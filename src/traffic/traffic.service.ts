import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as moment from 'moment';
import { PrismaService } from '../prisma/prisma.service'; // Import your Prisma service


@Injectable()
export class TrafficService {
  private readonly logger = new Logger(TrafficService.name);
  private readonly apiUrl =
  'http://172.16.10.138:8080/api/table.json?content=sensors&output=json&columns=objid,name,status,tags,device,downtime,downtimetime,downtimesince,uptime,uptimetime,warnsens,partialdownsens,downsens,message,lastup,lastcheck&count=*&id=0&noraw=1&usecaption=true&filter_tags=bw_EAAZ&username=Yonas.M&password=Test@123';

 private readonly DEFAULT_BANDWIDTH = 1000000;

  

  constructor(private readonly prisma: PrismaService) {} // Inject Prisma 
  private generateDateRange(interval:string) {
    const currentDate = moment();
    let startDate:string, endDate:string;
  
    if (interval === 'daily') {
        startDate = currentDate.startOf('day').subtract(1, 'day').format('YYYY-MM-DD-HH-mm-ss');
        endDate = currentDate.endOf('day').format('YYYY-MM-DD-HH-mm-ss');
      } else if (interval === 'weekly') {
        startDate = currentDate.startOf('week').subtract(1, 'day').format('YYYY-MM-DD-HH-mm-ss');
        endDate = currentDate.endOf('week').format('YYYY-MM-DD-HH-mm-ss');
      } else if (interval === 'monthly') {
        startDate = currentDate.startOf('month').subtract(1, 'day').format('YYYY-MM-DD-HH-mm-ss');
        endDate = currentDate.endOf('month').format('YYYY-MM-DD-HH-mm-ss');
      } else {
        throw new Error('Invalid interval. Supported intervals: daily, weekly, monthly');
      }
      //console.log( startDate, endDate)
    
    return { startDate, endDate };
  }
  
  private extractMatchedString(text: string, regex: RegExp, fallback: string): string {
    const match = text.match(regex);
    return match && match[1] ? match[1].trim() : fallback;
  }

  private async getParent(sensor: any) {
    const parentUrl = `http://172.16.10.138:8080/api/table.json?content=devices&output=json&columns=objid,device&count=*&filter_objid=${sensor.parentid}&username=Yonas.M&password=Test@123`;

    const parentResponse = await axios.get(parentUrl);
    const parent = parentResponse.data;

    const text23 = parent[0].device;
    const parentname = this.extractMatchedString(text23, /ADN::(.*?)CAP::/, text23);

    let name2: string;
    let name3: string;
    let trueId: number;

    if (parentname.includes('CS_') || parentname.includes('CS-')) {
      name3 = sensor.name;
      name2 = this.extractMatchedString(sensor.name, /ADN::(.*?)CAP::/, sensor.name);
      trueId = parseInt(sensor.objid);
    } else {
      name2 = parentname;
      name3 = text23;
      trueId = parseInt(sensor.parentid);
    }

    const bandwidthMatch = name3.match(/CAP::(\d+)/);
    const bandwidth = bandwidthMatch ? parseInt(bandwidthMatch[1]) : this.DEFAULT_BANDWIDTH;

    const name = sensor.name;

    const cn = this.extractMatchedString(name, /CN::(.*?_)/, '');
    const sn = this.extractMatchedString(name, /SN::(\d{9,20})/, '');
    const sct = this.extractMatchedString(name, /SCT::(.*?_)/, '');
    const sm = this.extractMatchedString(name, /smartgroup\d+(\.\d+)?/, '');

    const deviceName = cn + sn + sct + sm ? cn + sn + sct + sm : name;

    return { trueId, bandwidth, deviceName };
  }
// Function to fetch sensor data
private async fetchSensorData(): Promise<any[][]> {
  try {
    // Axios GET request to fetch sensor data
    const response = await axios.get(this.apiUrl);

    if (!response.data || !response.data.sensors) {
      throw new HttpException('No sensors data found', HttpStatus.NOT_FOUND);
    }
/////
//const fullInfoSensors=response.data.sensors;
const fullInfoSensors = await Promise.all(
  response.data.sensors.map(async (element:any) => {
    const above= await this.getParent(element);
    return {...element,...above}

  })
  
);


    // Slice data into chunks of 400
    const chunkedData = await this.sliceArray(fullInfoSensors, 400);

    return chunkedData;
  } catch (error) {
    console.error('Error fetching sensor data:', error.message);
    throw new HttpException(
      'Failed to fetch sensor data',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

   
private async sliceArray<T>(array: T[], numParts: number): Promise<T[][]> {
  const partSize = Math.ceil(array.length / numParts);
  const slicedArray: T[][] = [];

  for (let i = 0; i < array.length; i += partSize) {
    const chunk = array.slice(i, i + partSize);
    slicedArray.push(chunk);
  }

  return slicedArray;
}

   /**
   * Fetches historical data for a given sensor ID
   * @param sensor - The sensor object
   * @param startDate - The start date of the range
   * @param endDate - The end date of the range
   */
   private async fetchSensorHistoricData(sensor:any , startDate: string, endDate: string): Promise<any> {
    console.log(sensor.objid)
    const apiUrl = `http://172.16.10.138:8080/api/historicdata.json?id=${sensor.objid}&avg=3600&sdate=${startDate}&edate=${endDate}&usecaption=1&username=Yonas.M&password=Test@123`;

    return axios
      .get(apiUrl)
      .then(response => ({ sensor, data: response.data }))
      .catch(error => {
        console.error(`Error fetching data for sensor  ${sensor.objid}:`, error);
        return null;
      });
  }

  /**
   * Executes multiple Axios requests using Promise.all()
   * @param requests - An array of Axios requests
   */
  private async executeRequests(requests: Promise<any>[]): Promise<Record<number, any>> {
    const sensorData: Record<number, any> = {};

    const results = await Promise.all(requests);
    for (const result of results) {
      if (result) {
     
        console.log(result.data.histdata)
        sensorData[result.sensorId] = await this. calculateSpeedStats(result.data.histdata)
        console.log("sssssssssssssssssssssssssssssss"+JSON.stringify(sensorData))

      }
    }


////////    
    return sensorData;
  }

  /**
   * Processes and saves sensor data into the database
   * @param sensorData - The raw sensor data
   */
  private async saveSensorData(sensorData: Record<number, any>): Promise<void> {
/*     for (const sensorId in sensorData) {
      const sensor = sensorData[sensorId];
      for (const data of sensor.histdata) { */
       // const name = this.processSensorName(sensor.name);
//console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"+JSON.stringify(data))
//console.log("************************_________________________________")
        // Replace this with actual database save logic
     /*    //console.log('Saving sensor data:', {
          datetime: data.datetime,
          objid: sensorId,
         
          ...data,
        });
 */
        // Example: Replace with your ORM (e.g., Prisma or TypeORM)
        // await this.trafficRepository.create({
        //   datetime: data.datetime,
        //   objid: sensorId,
        //   name,
        //   status: sensor.status,
        //   tags: sensor.tags,
        //   device: sensor.device,
        //   ...data,
        // });
     // }
   // }
  }

  /**
   * Extracts and formats the sensor name based on patterns
   * @param name - The raw sensor name
   * @returns A formatted name
   */
  private processSensorName(name: string): string {
    const cnMatch = name.match(/ADN::(.*?_|^.*?_)/);
    const znMatch = name.match(/ZN::(.*?_|^.*?_)/);
    const snMatch = name.match(/SN::(\d{9,20})/);
    const sctMatch = name.match(/SCT::(.*?_)/);
    const smMatch = name.match(/smartgroup\d+(\.\d+)?/);

    const cn = cnMatch ? cnMatch[1].trim() : '';
    const zn = znMatch ? znMatch[1].trim() : '';
    const sn = snMatch ? snMatch[1].trim() : '';
    const sct = sctMatch ? sctMatch[1].trim() : '';
    const sm = smMatch ? smMatch[0].trim() : '';

    return cn + sn + sct + sm ? `${cn}-${sn}-${sct}-${sm}-${zn}` : name;
  }
  


  
  private  normalizeTrafficData(data) {
    return data.map((record) => {
      const normalizedRecord = {};
  
      for (const [key, value] of Object.entries(record)) {
        // Convert empty strings to null
        normalizedRecord[key] = value === '' ? null : value;
      }
  
      return normalizedRecord;
    });
  }
  

  private async calculateSpeedStats(
    histdata: any[],
  ): Promise<{
    sumTotalSpeed: number;
    sumOutSpeed: number;
    sumInSpeed: number;
    maxTotalSpeed: number;
    maxOutSpeed: number;
    maxInSpeed: number;
    minTotalSpeed: number;
    minOutSpeed: number;
    minInSpeed: number;
    peakHour: string | number;
  }> {
    let sumTotalSpeed = 0;
    let sumOutSpeed = 0;
    let sumInSpeed = 0;

    let maxTotalSpeed = -Infinity;
    let maxOutSpeed = -Infinity;
    let maxInSpeed = -Infinity;

    let minTotalSpeed = Infinity;
    let minOutSpeed = Infinity;
    let minInSpeed = Infinity;

    let peakHour: string | number = Infinity;
    const histdatas= this.normalizeTrafficData(histdata)
    // Iterate over historical data
    histdatas.forEach((hist) => {
  

      const totalSpeed = hist["Traffic Total (speed)"] || 0;
      const outSpeed = hist["Traffic Out (speed)"] || 0;
      const inSpeed = hist["Traffic In (speed)"] || 0;

      // Accumulate speed sums
      sumTotalSpeed += totalSpeed;
      sumOutSpeed += outSpeed;
      sumInSpeed += inSpeed;

      // Update maximum speeds and peak hour
      if (totalSpeed > maxTotalSpeed) {
        maxTotalSpeed = totalSpeed;
        peakHour = hist.datetime;
      }
      if (outSpeed > maxOutSpeed) {
        maxOutSpeed = outSpeed;
      }
      if (inSpeed > maxInSpeed) {
        maxInSpeed = inSpeed;
      }

      // Update minimum speeds
      if (totalSpeed < minTotalSpeed && totalSpeed !== 0) {
        minTotalSpeed = totalSpeed;
      }
      if (outSpeed < minOutSpeed && outSpeed !== 0) {
        minOutSpeed = outSpeed;
      }
      if (inSpeed < minInSpeed && inSpeed !== 0) {
        minInSpeed = inSpeed;
      }
    });

    // Handle cases where no data was available
    minTotalSpeed = minTotalSpeed === Infinity ? 0 : minTotalSpeed;
    minOutSpeed = minOutSpeed === Infinity ? 0 : minOutSpeed;
    minInSpeed = minInSpeed === Infinity ? 0 : minInSpeed;

    maxTotalSpeed = maxTotalSpeed === -Infinity ? 0 : maxTotalSpeed;
    maxOutSpeed = maxOutSpeed === -Infinity ? 0 : maxOutSpeed;
    maxInSpeed = maxInSpeed === -Infinity ? 0 : maxInSpeed;

    peakHour = peakHour === Infinity ? 'No Data' : peakHour;

    // Convert speeds to Mbps (bits to megabits)
    const convertToMbps = (speed: number): number => (speed * 8) / 1000;

    return {
      sumTotalSpeed,
      sumOutSpeed,
      sumInSpeed,
      maxTotalSpeed: convertToMbps(maxTotalSpeed),
      maxOutSpeed: convertToMbps(maxOutSpeed),
      maxInSpeed: convertToMbps(maxInSpeed),
      minTotalSpeed: convertToMbps(minTotalSpeed),
      minOutSpeed: convertToMbps(minOutSpeed),
      minInSpeed: convertToMbps(minInSpeed),
      peakHour,
    };
  }

  

  async processTrafficData() {

const smallerArrays = await this.fetchSensorData()
const interval = 'daily';


for (const sensorChunk of smallerArrays) {
    const { startDate, endDate } = this.generateDateRange(interval);
    console.log(startDate,endDate)
    const requests = sensorChunk.map(async sensor =>
    await  this.fetchSensorHistoricData(sensor, startDate, endDate)

    );
   

    const sensorData = await this.executeRequests(requests);

    if (sensorData) {

      //await this.saveSensorData(sensorData);
    }
    await new Promise(resolve => setTimeout(resolve, 1 * 60 * 1000));
  
  }


return smallerArrays;
  }




}