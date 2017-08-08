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
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
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
            logger.Info("dt=" + dt + "typ=" + typ);
            if (tp == "R4"||tp=="R5"||tp=="R11")
            {
                try
                {
                    var MappedFlights = app.MappedFlightView.Query(a => a.TimeFrom.Date == dt.Date && a.TimeFrom.Month == dt.Month && a.TimeFrom.Year == dt.Year && a.R4_H_RMS > 0).ToList();
                    var Flights = app.FlightView.Query(x => x.DateofFlight.Date == dt.Date && x.DateofFlight.Month == dt.Month && x.DateofFlight.Year == dt.Year && x.HasPlotInCAV == 1 && x.SensorID == 2).ToList();
                    var data = new List<FlightListViewModel>();
                    if (MappedFlights == null || Flights == null)
                    {
                        logger.Info("Info can not get Flight or MappedFlight: " + Flights.Count() + ":" + MappedFlights.Count());
                        return Json(new { status = false }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        foreach (var mappedFlight in MappedFlights)
                        {
                            var queryFlight = Flights.Where(x => x.ID == mappedFlight.FlightID).SingleOrDefault();
                            if (queryFlight != null)
                            {
                                var item = new FlightListViewModel();
                                item.AircraftID = queryFlight.AircraftID;
                                item.Id = queryFlight.ID;
                                item.Mode3ACode = queryFlight.Mode3ACode;
                                item.SensorID = queryFlight.SensorID;
                                item.DateOfFlight = queryFlight.DateofFlight;
                                item.FilePath = queryFlight.FilePath;
                                item.CallSign = queryFlight.CallSign;
                                item.TimeFrom = queryFlight.TimeFrom.ToString("MM/dd/yyyy HH:mm:ss.fff ");
                                item.TimeTo = queryFlight.TimeTo.ToString("MM/dd/yyyy HH:mm:ss.fff ");
                                item.CreateTime = queryFlight.CreateTime;
                                item.ProcessRound = queryFlight.ProcessRound;
                                item.R2_5M = queryFlight.R2_5M.ToString();
                                item.R2_5R = queryFlight.R2_5R.ToString();
                                item.R3_5M = queryFlight.R3_5M_NG_LONGGAP_COUNT;
                                item.R7_5M = queryFlight.R7_5M;
                                item.R7_5R = queryFlight.R7_5R;
                                item.R8_5M = queryFlight.R8_MFL_AGE_AVG;
                                item.R9_5M = queryFlight.R9_MFL_AGE_MAX;
                                item.R14_5M = queryFlight.R14_5M;
                                item.R14_5R = queryFlight.R14_5R;
                                item.NT_5M = queryFlight.R2_5M_NT;
                                item.indicator = queryFlight.Indicator;
                                item.R4 = mappedFlight.R4_H_RMS;
                                item.R5 = mappedFlight.R5_H_CE_R_5N;
                                item.R11 = mappedFlight.R11_V_RMS;
                                data.Add(item);
                            }

                        }
                        return Json(data, JsonRequestBehavior.AllowGet);
                    }
                }
                catch (Exception e)
                {
                    logger.Error("Error exeption in R4:" + "(" + e.Message + ")");
                    return null;
                }
            }
            else
            {
                try
                {

                    int sensorId = typ == "ADS-B" ? 1 : 2;
                    var Flights = app.FlightView.Query(x => x.DateofFlight.Date == dt.Date && x.DateofFlight.Month == dt.Month && x.DateofFlight.Year == dt.Year && x.HasPlotInCAV == 1 && x.SensorID == sensorId).ToList();


                    var MappedFlights = app.MappedFlightView.Query(a => a.TimeFrom.Date == dt.Date && a.TimeFrom.Month == dt.Month && a.TimeFrom.Year == dt.Year).ToList();

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
                            //if (tp == "R4" || tp == "R5" || tp == "R11")
                            //{
                            //    var queryMapped = new MappedFlightView();
                            //    if (typ == "SSR/MRT")
                            //    {
                            //        queryMapped = MappedFlights.Where(a => a.FlightID == Flight.ID).SingleOrDefault();
                            //    }
                            //    else if (typ == "ADS-B")
                            //    {
                            //        queryMapped = MappedFlights.Where(a => a.AnotherFlightID == Flight.ID).SingleOrDefault();
                            //    }
                            //    if (queryMapped != null)
                            //    {
                            //        item.R4 = queryMapped.R4_H_RMS;
                            //        item.R5 = queryMapped.R5_H_CE_R_5N;
                            //        item.R11 = queryMapped.R11_V_RMS;
                            //    }
                            //}
                            data.Add(item);
                        }
                        var ans = Json(data, JsonRequestBehavior.AllowGet);
                        ans.MaxJsonLength = int.MaxValue;
                        return ans;
                    }
                }
                catch (Exception e)
                {
                    logger.Error("Error exception in query:" + "(" + e.Message + ")");
                    return null;
                }
            }
            
        }

        [System.Web.Http.HttpGet]
        public JsonResult GetMappedFlight(DateTime dt, string typ)
        {
            //int sensorId = typ == "ADS-B" ? 1 : 2;
            try
            {
                //var Flights = app.FlightView.Query(x => x.DateofFlight.Date == dt.Date && x.DateofFlight.Month == dt.Month && x.DateofFlight.Year == dt.Year&&x.HasPlotInCAV==1&&x.SensorID== sensorId).ToList();
                var Flights = app.FlightView.Query(x => x.DateofFlight.Date == dt.Date && x.DateofFlight.Month == dt.Month && x.DateofFlight.Year == dt.Year && x.HasPlotInCAV == 1 && x.SensorID == 2).ToList();
                var MappedFlights = app.MappedFlightView.Query(a => a.TimeFrom.Date == dt.Date && a.TimeFrom.Month == dt.Month && a.TimeFrom.Year == dt.Year && a.R4_H_RMS>0).ToList();

               
                var data = new List<MappedFlightViewModel>();
                if (Flights == null)
                {
                    return Json(new { status = false }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    logger.Info("Flights count=" + Flights.Count());
                    foreach (var mappedFlight in MappedFlights)
                    {
                        var item = new MappedFlightViewModel();
                        List<MappedFlightView> Mapped = new List<MappedFlightView>();
                        //if (typ == "SSR/MRT")
                        //{
                        //    Mapped = MappedFlights.Where(a => a.FlightID == Flight.ID).ToList();
                        //}
                        //else if (typ == "ADS-B")
                        //{
                        //    Mapped = MappedFlights.Where(a => a.AnotherFlightID == Flight.ID).ToList();
                        //}
                        var queryFlight = Flights.Where(x => x.ID == mappedFlight.FlightID).SingleOrDefault();
                        if (queryFlight!=null)
                        {
                                item.FlightID = mappedFlight.FlightID;
                                item.R4_RMS = mappedFlight.R4_H_RMS;
                                item.R5 = mappedFlight.R5_H_CE_R_5N;
                                item.R11 = mappedFlight.R11_V_RMS;
                            item.indicator = queryFlight.Indicator;
                                data.Add(item);
                            
                        }
                        else
                        {
                            logger.Error("Error count:" + mappedFlight.Id);
                        }
                    }
                    return Json(data, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                logger.Error("Error:"+"(" + e.Message+")");
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
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
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
                logger.Error("Error: Pst indicator"  + "(" + e.Message + ")");
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