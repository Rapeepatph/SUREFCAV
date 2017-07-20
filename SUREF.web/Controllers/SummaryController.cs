using SUREF.Data.Models;
using SUREF.Models;
using SUREF.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace SUREF.Controllers
{
    [System.Web.Mvc.Authorize]
    public class SummaryController : Controller
    {
        private App app = new App();
        // GET: Summary
        public ActionResult Index(string selectedDate,int sensorid)
        {
            if(selectedDate == null)
            {
                var lastestFlight = app.FlightView.Query(x => x.SensorID == 1).OrderByDescending(x => x.DateofFlight).FirstOrDefault();
                ViewBag.RecentlyDate = lastestFlight.DateofFlight.Day + "-" + lastestFlight.DateofFlight.Month + "-" + lastestFlight.DateofFlight.Year;
            }
            else
            {
                ViewBag.RecentlyDate = selectedDate;
            }
            ViewBag.SensorId = sensorid;
            return View();
        }
        public ActionResult Landing()
        {
            var lastestFlight = app.FlightView.Query(x => x.SensorID == 1).OrderByDescending(x => x.DateofFlight).FirstOrDefault();
            ViewBag.RecentlyDate = lastestFlight.DateofFlight.Day + "-" + lastestFlight.DateofFlight.Month + "-" + lastestFlight.DateofFlight.Year;
            return View();
        }
        public ActionResult History()
        {
            var Flights = app.FlightView.All().OrderByDescending(x => x.DateofFlight).ToList();
            var lastestFlight = Flights.FirstOrDefault();
            ViewBag.RecentlyDate = lastestFlight.DateofFlight.Day + "-" + lastestFlight.DateofFlight.Month + "-" + lastestFlight.DateofFlight.Year;
            //DateModel dt = new DateModel();
            //dt.collectedDates = new List<DateTime>();
            //int i = 0;
            //foreach (var flight in Flights)
            //{
            //    dt.collectedDates.Add(flight.DateofFlight);
            //    i++;
            //}
            return View();
        }
        public ActionResult detail(string topic,DateTime dt,string typ,string x)
        {
            ViewBag.Xe = x;
            ViewBag.Date = dt;
            ViewBag.Topic = topic;
            ViewBag.Typ = typ;
            ViewBag.Dt= dt.Year+ "-" + dt.Month.ToString("00") +  "-" +dt.Day.ToString("00");
            return View();
        }
        [System.Web.Http.HttpGet]
        public JsonResult GetFlight(DateTime dt,string typ,string tp)
        {
            try
            {
                var Flights = app.FlightView.Query(x => x.DateofFlight.Date == dt.Date && x.DateofFlight.Month == dt.Month && x.DateofFlight.Year == dt.Year&&x.HasPlotInCAV==1&&x.AircraftID!="X").ToList();
                var MappedFlights = app.MappedFlightView.Query(a => a.TimeFrom.Date == dt.Date && a.TimeFrom.Month == dt.Month && a.TimeFrom.Year == dt.Year).ToList();
                if (typ=="ADS-B")
                {
                    Flights = Flights.Where(a => a.SensorID == 1).ToList();    //hard code SensorID
                }
                else if(typ== "SSR/MRT")
                {
                    Flights=Flights.Where(a => a.SensorID == 2).ToList();  //hard code SensorID
                }
                else
                {
                    Flights = null;
                } 
                var data = new List<FlightListViewModel>();
                if (Flights == null)
                {
                    return Json(new { status = false }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    foreach (var Flight in Flights)
                    {
                        var item = new FlightListViewModel();
                        item.AircraftID = Flight.AircraftID;
                        item.Id = Flight.ID;
                        item.Mode3ACode = Flight.Mode3ACode;
                        item.SensorID = Flight.SensorID;
                        item.DateOfFlight = Flight.DateofFlight;
                        item.FilePath = Flight.FilePath;
                        item.CallSign = Flight.CallSign;
                        item.TimeFrom = Flight.TimeFrom.ToString("MM/dd/yyyy HH:mm:ss.fff ");
                        item.TimeTo = Flight.TimeTo.ToString("MM/dd/yyyy HH:mm:ss.fff ");
                        item.CreateTime = Flight.CreateTime;
                        item.ProcessRound = Flight.ProcessRound;
                        item.R2_5M = Flight.R2_5M.ToString();
                        item.R2_5R = Flight.R2_5R.ToString();
                        item.R3_5M = Flight.R3_5M_NG_LONGGAP_COUNT;
                        item.R7_5M = Flight.R7_5M;
                        item.R7_5R = Flight.R7_5R;
                        item.R8_5M = Flight.R8_MFL_AGE_AVG;
                        item.R9_5M = Flight.R9_MFL_AGE_MAX;
                        item.R14_5M = Flight.R14_5M;
                        item.R14_5R = Flight.R14_5R;
                        item.NT_5M = Flight.R2_5M_NT;
                        item.indicator = Flight.Indicator;
                        if(tp=="R4" || tp == "R5" || tp == "R11")
                        {
                            var queryMapped = new MappedFlightView();
                            if (typ == "SSR/MRT")
                            {
                                queryMapped = MappedFlights.Where(a => a.FlightID == Flight.ID).SingleOrDefault();
                            }
                            else if (typ == "ADS-B")
                            {
                                queryMapped = MappedFlights.Where(a => a.AnotherFlightID == Flight.ID).SingleOrDefault();
                            }
                            if(queryMapped!=null)
                            {
                                item.R4 = queryMapped.R4_H_RMS;
                                item.R5 = queryMapped.R5_H_CE_R_5N;
                                item.R11 = queryMapped.R11_V_RMS;
                            }
                        }
                        data.Add(item);
                    }
                    return Json(data, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        [System.Web.Http.HttpGet]
        public JsonResult GetMappedFlight(DateTime dt, string typ)
        {
            try
            {
                var Flights = app.FlightView.Query(x => x.DateofFlight.Date == dt.Date && x.DateofFlight.Month == dt.Month && x.DateofFlight.Year == dt.Year&&x.HasPlotInCAV==1).ToList();
                var MappedFlights = app.MappedFlightView.Query(a => a.TimeFrom.Date == dt.Date && a.TimeFrom.Month == dt.Month && a.TimeFrom.Year == dt.Year).ToList();
                if (typ == "ADS-B")
                {
                    Flights = Flights.Where(a => a.SensorID == 1).ToList();    //hard code SensorID
                }
                else if (typ == "SSR/MRT")
                {
                    Flights = Flights.Where(a => a.SensorID == 2).ToList();  //hard code SensorID
                }
                else
                {
                    Flights = null;
                }
                var data = new List<MappedFlightViewModel>();
                if (Flights == null)
                {
                    return Json(new { status = false }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    foreach (var Flight in Flights)
                    {
                        var item = new MappedFlightViewModel();
                        var Mapped = new MappedFlightView();
                        if (typ== "SSR/MRT")
                        {
                            Mapped = MappedFlights.Where(a => a.FlightID == Flight.ID).SingleOrDefault();
                        }
                        else if(typ== "ADS-B")
                        {
                            Mapped = MappedFlights.Where(a => a.AnotherFlightID == Flight.ID).SingleOrDefault();
                        }
                        if (Mapped != null)
                        {
                            item.AnotherFlightID = Mapped.AnotherFlightID;
                            item.R4_RMS = Mapped.R4_H_RMS;
                            item.R5 = Mapped.R5_H_CE_R_5N;
                            item.R11 = Mapped.R11_V_RMS;
                            data.Add(item);
                        }
                    }
                    return Json(data, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
        [System.Web.Http.HttpGet]
        public JsonResult getDate()
        {
            var Flights = app.FlightView.All().OrderByDescending(x => x.DateofFlight).ToList();
            //var lastestFlight = Flights.FirstOrDefault();
            //ViewBag.RecentlyDate = lastestFlight.DateofFlight.Day + "-" + lastestFlight.DateofFlight.Month + "-" + lastestFlight.DateofFlight.Year;
            var data = new List<DateModel>();
            foreach (var flight in Flights)
            {
                bool has = data.Exists(element => element.collectedDates == flight.DateofFlight);
                if (!has)
                {
                    var item = new DateModel();
                    item.collectedDates = flight.DateofFlight;
                    item.DateString = flight.DateofFlight.Year + "-" + flight.DateofFlight.Month + "-" + flight.DateofFlight.Day;
                    data.Add(item);
                }
            }
            return Json(data, JsonRequestBehavior.AllowGet);
        } 
        protected override void Dispose(bool disposing)
        {
            if (disposing) app.Dispose();
            base.Dispose(disposing);
        }
        
    }
    public class SummaryApiController : ApiController
    {
        [System.Web.Http.HttpGet]
        public IHttpActionResult Get()
        {
            return this.Ok();
        }
        [System.Web.Http.HttpPost]
        public IHttpActionResult Post([FromBody] InputRequest request)
        {
            SUREFEntities db = new SUREFEntities();
            //string[] dt = request.dtInput.Split('-');
            int newIndicator = 0;
            CultureInfo provider = CultureInfo.InvariantCulture;
            DateTime dt = DateTime.ParseExact(request.dtInput, "yyyy-MM-dd", provider);
            try
            {
                var flights = db.Flights.Where(x => x.AircraftID == request.aircraftid && x.DateofFlight.Day == dt.Day && x.DateofFlight.Month == dt.Month && x.DateofFlight.Year == dt.Year).ToList();
                if (flights.Count() >0)
                {
                    foreach (var item in flights)
                    {
                        newIndicator = item.Indicator == 0 ? 1 : 0;
                        item.Indicator = newIndicator;
                        db.SaveChanges();
                    }
                    db.Dispose();
                    return this.Ok(newIndicator);
                }
                else
                {
                    return this.Ok(dt);
                }
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
            
        }
        public class InputRequest
        {
            public string  aircraftid { get; set; }
            public string dtInput { get; set; }
        }
    }
}