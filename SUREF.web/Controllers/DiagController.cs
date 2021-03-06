﻿using Newtonsoft.Json;
using SUREF.Data.Models;
using SUREF.Models;
using SUREF.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SUREF.Controllers
{
    [System.Web.Mvc.Authorize]
    public class DiagController : Controller
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private App app = new App(testing: false);
        // GET: Diag
        public ActionResult Index(string id,string typ, string dt)
        {
            ViewBag.AircraftID = id;
            ViewBag.Typ = typ;
            ViewBag.Date = dt;
            return View();
        }
        [HttpGet]
        public JsonResult getData(string id,string typ,DateTime dt)
        {
            string sensorName = typ == "SSR/MRT" ? "MRT-TopSky" : typ;
            var sensor = app.SensorView.Query(a => a.Name == sensorName).SingleOrDefault();
            var flight = app.FlightView.Query(x => x.SensorID == sensor.ID && x.DateofFlight.DayOfYear == dt.DayOfYear && x.AircraftID == id).FirstOrDefault();
            //var MappedFlights = app.MappedFlightView.Query(a => a.TimeFrom.Date == dt.Date && a.TimeFrom.Month == dt.Month && a.TimeFrom.Year == dt.Year).ToList();
            using (SUREFEntities db = new SUREFEntities())
            {
                try
                {
                    var mapped = new DMappedFlightView();
                    if (sensorName == "MRT-TopSky")
                    {
                        mapped = db.DMappedFlightViews.Where(a => a.TimeFrom.Day == dt.Day && a.TimeFrom.Month == dt.Month && a.TimeFrom.Year == dt.Year && a.FlightID==flight.ID).FirstOrDefault();
                    }
                    else if (sensorName == "ADS-B")
                    {
                        //mapped = db.DMappedFlightViews.Where(a => a.TimeFrom.Day == dt.Day && a.TimeFrom.Month == dt.Month && a.TimeFrom.Year == dt.Year && a.AnotherFlightID == flight.ID).FirstOrDefault();  //Actually it's not use this section or maybe error cause query more than 1 data.
                    }
                        //if (sensorName == "MRT-TopSky")
                        //{
                        //    mapped = MappedFlights.Where(b => b.FlightID == flight.ID).FirstOrDefault();
                        //}
                        //else if (sensorName == "ADS-B")
                        //{
                        //    mapped = MappedFlights.Where(b => b.AnotherFlightID == flight.ID).FirstOrDefault();
                        //}
                    if (mapped != null)
                    {
                        var DeserializeDatas = JsonConvert.DeserializeObject<Dictionary<long, Dictionary<string, string>>>(mapped.R4_H_Diagnose);
                        var _datas = new List<DiagJsonModel>();
                        int count = 0;
                        string[] refPoints = new string[] { "REF_", "REF1_", "REF2_" };
                        foreach (var data in DeserializeDatas)
                        {
                            var item = new DiagJsonModel();
                            item = CreatedObj(data.Value, data.Key, count);
                            _datas.Add(item);
                            count++;
                        }
                        return Json(_datas, JsonRequestBehavior.AllowGet);
                    }
                }
                catch (Exception e)
                {
                    logger.Error("Error exeption in Diag query:" + "(" + e.Message + ")");
                    return null;
                }
            }
            return null;
        }

        private DiagJsonModel CreatedObj(Dictionary<string, string> data,long keytime,int count)
        {
            var item = new DiagJsonModel();
            item.Time = GetTime(keytime);
            item.LAT = data["LAT"];
            item.LNG = data["LNG"];
            item.REF_LAT = data["REF_LAT"];
            item.REF_LNG = data["REF_LNG"];
            item.REF1_LAT = data["REF1_LAT"];
            item.REF1_LNG = data["REF1_LNG"];
            item.REF1_Tick= GetTime(long.Parse(data["REF1_TICK"]));
            item.REF2_LAT = data["REF2_LAT"];
            item.REF2_LNG = data["REF2_LNG"];
            item.REF2_Tick = GetTime(long.Parse(data["REF2_TICK"]));
            item.Distance = GetDistance(data["LAT"], data["LNG"], data["REF_LAT"], data["REF_LNG"]);
            item.PointNo = count;
            return item;
        }

        private string GetTime(long keytime)
        {
            DateTime dtime = new DateTime(keytime);
            return dtime.ToString(" HH:mm:ss.fff ");
        }

        private double GetDistance(string lat, string lng, string ref_lat, string ref_lng)
        {
            double R = 6378137;
            double Lat = double.Parse(lat);
            double Lng = double.Parse(lng);
            double REF_LAT = double.Parse(ref_lat);
            double REF_LNG = double.Parse(ref_lng);
            double dLat = toRad(REF_LAT - Lat);
            double dLng = toRad(REF_LNG - Lng);
           double  f = squared(Math.Sin(dLat / 2.0)) + Math.Cos(toRad(Lat)) * Math.Cos(toRad(REF_LAT)) * squared(Math.Sin(dLng / 2.0));
            double c = 2 * Math.Atan2(Math.Sqrt(f), Math.Sqrt(1 - f));
            double result = ((R * c) / 1000);
            return result;
        }

        private double squared(double v)
        {
            return v * v;
        }

        private double toRad(double v)
        {
            return v * Math.PI / 180;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) app.Dispose();
            base.Dispose(disposing);
        }
    }
}