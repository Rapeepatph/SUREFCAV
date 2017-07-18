using Newtonsoft.Json;
using SurveillanceDataKeeper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace SUREF.Models
{
    public class GetJsonData
    {
        public static List<List<object>> getData(string path,string date)
        {
            List<List<object>> result = new List<List<object>>(); 
            //string date = "20161102";            
            //string filename = "C:\\Users\\Rapeepatph\\Documents\\Visual Studio 2015\\Projects\\lib for n p\\temp_21_62top\\1\\"+date+"\\"+key;
            if (File.Exists(path))
            {
                string[] lines = System.IO.File.ReadAllLines(path);
                foreach (string line in lines)
                {
                    string[] elements = line.Split('|');
                    try
                    {
                        IMetaDataS meta = new MetaDataS();
                        meta.StringToObj(line);
                        DateTime dt = getDateTime(date, meta.TimeOfDay);        
                        if (meta.Latitude == null) continue;
                        double latitude = meta.Latitude.Value;                  
                        if (meta.Longitude == null) continue;
                        double longitude = meta.Longitude.Value;                
                        double? geoMetricheight = (meta.Cat == 21) ? meta.GeometricHeight : meta.GeometricAltitude;
                        double? height = meta.FlightLevel;                      
                        short sic = meta.SelectedSIC;
                        double? baroMetricAltitude = meta.BarometricAltitude;                       
                        int cat = meta.Cat;
                        short? nucp = meta.NUCp_NIC;         
                        double?climbRate = meta.ClimbRate;
                        double? Vx= meta.Vx;
                        double? Vy = meta.Vy;
                        double? flightLevelAge = meta.MeasuredFlightLevelAge;
                        string callsign =meta.Callsign;
                        string aircraftAddress =meta.AircraftAddress;
                        string modecode=meta.Mode3A;
                        string trackNo = meta.TrackNo;
                        double? groundSpeed = meta.GroundSpeed;
                        List<string> source = meta.Source;
                        List<short> sic_list = new List<short>();
                        if(source !=null)
                        {
                            foreach (string item in source)
                            {
                                string[] element = item.Split(',');
                                sic_list.Add(Int16.Parse(element[1]));
                            }
                        }
                        List<object> each = new List<object>();
                        //string eachPoint = dt.ToString("yyyy-MM-dd hh:mm:ss.fff") + "," + latitude + "," + longitude + "," + sic.ToString() + "," + JsonConvert.SerializeObject(sic_list);                
                        each.Add(dt.ToString("yyyy-MM-dd HH:mm:ss.fff"));               //0
                        each.Add(latitude);                                             //1
                        each.Add(longitude);                                            //2
                        each.Add((height == null)?"n/a": height.Value.ToString());      //3
                        each.Add(sic);                                                  //4
                        each.Add(sic_list);                                             //5
                        each.Add(cat);                                                  //6
                        each.Add(geoMetricheight);                                      //7
                        each.Add(baroMetricAltitude);                                   //8
                        each.Add(nucp);                                                 //9
                        each.Add(climbRate);                                            //10
                        each.Add(Vx);                                                   //11
                        each.Add(Vy);                                                   //12
                        each.Add(flightLevelAge);                                       //13
                        each.Add(callsign);                                             //14
                        each.Add(aircraftAddress);                                      //15
                        each.Add(modecode);                                             //16
                        each.Add(trackNo);                                              //17
                        each.Add(groundSpeed);                                          //18
                        result.Add(each);
                    }
                    catch(Exception ex)
                    {
                        throw ex;
                    }
                }
                return result;
            }
            return null;

        }

        public static DateTime getDateTime(string date, double timeOfDay)
        {
            int year = Int32.Parse(date.Substring(0, 4));
            int month = Int32.Parse(date.Substring(4, 2));
            int day = Int32.Parse(date.Substring(6, 2));
            DateTime result = new DateTime(year,month,day,0,0,0);
            result = result.AddSeconds(timeOfDay);
            return result;
        }
    }
}