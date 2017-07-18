using SUREF.Data.Models;
using SUREF.Models;
using SUREF.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace SUREF.Controllers
{
    [Authorize]
    public class MapController : Controller
    {
        private App app = new App(testing: false);
        // GET: Map
        public ActionResult Index(string id,string date,string typ,DateTime dt)
        {
            string sensorName = typ == "SSR/MRT" ? "MRT-TopSky" : typ;
            var sensor = app.SensorView.Query(a => a.Name == sensorName).SingleOrDefault();
            var flight = app.FlightView.Query(x => x.SensorID==sensor.ID&&x.DateofFlight.DayOfYear==dt.DayOfYear&& x.AircraftID == id).FirstOrDefault();
            ViewBag.TimeFrom = flight.TimeFrom.TimeOfDay;
            ViewBag.TimeTo = flight.TimeTo.TimeOfDay;
            ViewBag.AircraftID = id;
            ViewBag.Date = Regex.Replace(date, "-", "");
            return View();
        }
        public ActionResult Details(string id, string date,string topic,string typ,DateTime dt,string dtstring)
        {
            string sensorName = typ == "SSR/MRT" ? "MRT-TopSky" : typ;
            var sensor = app.SensorView.Query(a => a.Name == sensorName).SingleOrDefault();
            var flight = app.FlightView.Query(x => x.SensorID == sensor.ID && x.DateofFlight.DayOfYear == dt.DayOfYear && x.AircraftID == id).FirstOrDefault();
            ViewBag.TimeFrom = flight.TimeFrom.ToString(); ;
            ViewBag.TimeTo = flight.TimeTo.ToString();
            ViewBag.AircraftID = id;
            ViewBag.Date = Regex.Replace(date, "-", "");
            ViewBag.Topic = topic;
            ViewBag.Typ = typ;
            ViewBag.DateTimeSet = dtstring;
            if (topic == "R2")
            {
                ViewBag.Headline = "8 Seconds Probability of Update (R2 Mandatory)";
            }
            else if(topic== "R2R")
            {
                ViewBag.Headline = "6 Seconds Probability of Update (R2 Recommended)";
            }
            else if(topic== "R3")
            {
                ViewBag.Headline = "Ratio of missed 3D position in long gaps (R3)";
            }
            else if (topic == "R4")
            {
                ViewBag.Headline = "Horizontal position RMS error (R4)";
            }
            else if (topic == "R5")
            {
                ViewBag.Headline = "Three consecutive correlated horizontal position errors (R5)";
            }
            else if (topic == "R7")
            {
                ViewBag.Headline = "8 Seconds Probability of Update (R7 Mandatory)";
            }
            else if (topic == "R7R")
            {
                ViewBag.Headline = "6 Seconds Probability of Update (R7 Recommended)";
            }
            else if (topic == "R8")
            {
                ViewBag.Headline = "Pressure altitude average data age (R8)";
            }
            else if (topic == "R9")
            {
                ViewBag.Headline = "Pressure altitude maximum data age (R9)";
            }
            else if (topic == "R11")
            {
                ViewBag.Headline = "Pressure altitude unsigned error (R11)";
            }
            else if (topic == "R14")
            {
                ViewBag.Headline = "8 Seconds Probability of update (R14 Mandatory)";
            }
            else if (topic == "R14R")
            {
                ViewBag.Headline = "6 Seconds Probability of update (R14 Recommened)";
            }
            else if (topic == "chgIdent")
            {
                ViewBag.Headline = "Change of Identification";
            }
            else if (topic == "infoCD")
            {
                ViewBag.Headline = "Rate of Climb / Descend Information";
            }
            else if (topic == "trackVelo")
            {
                ViewBag.Headline = "Track Velocity";
            }
            else if (topic == "sensorSel")
            {
                ViewBag.Headline = "Sensor Selection Information";
            }
            else if (topic == "al62")
            {
                ViewBag.Headline = "Barometric Altitude / Geometric Altitude Comparison (CAT62)";
            }
            else if (topic == "al21")
            {
                ViewBag.Headline = "Barometric Altitude / Geometric Altitude Comparison (CAT21)";
            }
            else if (topic == "nucp")
            {
                ViewBag.Headline = "NUCP";
            }
            return View();
        }
        public ActionResult CoverageMap()
        {
            return View();
        }
        public ActionResult testMap()
        {
            return View();
        }
        [HttpGet]
        public JsonResult getAdsb()
        {
            try
            {
                Surveillance sur = new Surveillance();
                List<SurveillanceModel> result = new List<SurveillanceModel>();
                string path = ControllerContext.HttpContext.Server.MapPath("~/DataConfig/ADSBPosition.xml");
                result = sur.GetData(path);
                if (result == null)
                {
                    return Json(new { status = false }, JsonRequestBehavior.AllowGet);
                }
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return null;
            }
        }
        [HttpGet]
        public JsonResult getSSR()
        {
            try
            {
                Surveillance sur = new Surveillance();
                List<SurveillanceModel> result = new List<SurveillanceModel>();
                string path = ControllerContext.HttpContext.Server.MapPath("~/DataConfig/SSRPosition.xml");
                result = sur.GetData(path);
                if (result == null)
                {
                    return Json(new { status = false }, JsonRequestBehavior.AllowGet);
                }
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return null;
            }
        }
        [HttpGet]
        public JsonResult getTrack(int sensor,string date,string id)
        {
            try
            {
                //string path = ControllerContext.HttpContext.Server.MapPath("~/Data/" + sensor + "/" + date + "/" + id);
                string path = "C:\\tempcav\\" + sensor + "\\" + date + "\\" + id;
                List<List<object>> result = GetJsonData.getData(path,date);
                if (result == null)
                {
                    return Json(new { status = false }, JsonRequestBehavior.AllowGet);
                }
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch(Exception)
            {
                return null;
            }
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing) app.Dispose();
            base.Dispose(disposing);
        }
    }
}