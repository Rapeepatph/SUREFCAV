using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml;

namespace SUREF.Models
{
    public class SurveillanceModel
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public int SIC { get; set; }
        public float Lat { get; set; }
        public float Lng { get; set; }

        public SurveillanceModel(string name, string type, int sic, float lat, float lng)
        {
            Name = name;
            Type = type;
            SIC = sic;
            Lat = lat;
            Lng = lng;
        }
    }
   public class Surveillance
    {
        public  List<SurveillanceModel> GetData(string path)
        {
            try
            {
                List<SurveillanceModel> _adsbs = new List<SurveillanceModel>();
                XmlDocument doc = new XmlDocument();
                doc.Load(path);
                foreach (XmlNode node in doc.DocumentElement)
                {
                    string name = node["name"].InnerText;
                    string type = node["type"].InnerText;
                    int sic = int.Parse(node["sic"].InnerText);
                    float lat = ChangeToDouble(node["lat"].InnerText);
                    float lng = ChangeToDouble(node["lng"].InnerText);
                    SurveillanceModel adsb = new SurveillanceModel(name, type, sic, lat, lng);
                    _adsbs.Add(adsb);
                }
                return _adsbs;
            }
            catch(Exception e)
            {
                throw e;
            }
        }

        private float ChangeToDouble(string innerText)
        {
            try
            {
                string[] data = innerText.Split('|');
                float Degree, Lipda, Filipda, Output;
                Degree = float.Parse(data[0]);
                Lipda = float.Parse(data[1]) / 60;
                Filipda = float.Parse(data[2]) / 3600;
                Output = Degree + Lipda + Filipda;
                return Output;
            }
            catch(Exception e)
            {
                throw e;
            }
        }
    }

}