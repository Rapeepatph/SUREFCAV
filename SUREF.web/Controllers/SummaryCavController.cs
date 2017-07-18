using SUREF.Models;
using SUREF.Services;
using SUREFCAV.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SUREF.Controllers
{
    public class SummaryCavController : Controller
    {
        private App app = new App();
        // GET: SummaryCav
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult detail(string topic, DateTime dt, string typ, string x)
        {
            ViewBag.Xe = x;
            ViewBag.Date = dt;
            ViewBag.Topic = topic;
            ViewBag.Typ = typ;
            ViewBag.Dt = dt.Year + "-" + dt.Month.ToString("00") + "-" + dt.Day.ToString("00");
            return View();
        }
        [HttpGet]
        public JsonResult GetFlight(DateTime dt, string typ, string tp)

        {
            try
            {
                var fli = app.Flight.All();
                var Flights = app.Flight.Query(x => x.DateofFlight.Date == dt.Date && x.DateofFlight.Month == dt.Month && x.DateofFlight.Year == dt.Year&&x.HasPlotInCAV==1).ToList();
                var MappedFlights = app.MappedFlight.Query(a => a.TimeFrom.Date == dt.Date && a.TimeFrom.Month == dt.Month && a.TimeFrom.Year == dt.Year).ToList();
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
                        item.R3_5M = Flight.R3_5M_NG_LONGGAP_COUNT;
                        item.R7_5M = Flight.R7_5M;
                        item.R8_5M = Flight.R8_MFL_AGE_AVG;
                        item.R9_5M = Flight.R9_MFL_AGE_MAX;
                        item.R14_5M = Flight.R14_5M;
                        item.NT_5M = Flight.R2_5M_NT;
                        if (tp == "R4" || tp == "R5" || tp == "R11")
                        {
                            var queryMapped = new MappedFlight();
                            if (typ == "SSR/MRT")
                            {
                                queryMapped = MappedFlights.Where(a => a.FlightID == Flight.ID).SingleOrDefault();
                            }
                            else if (typ == "ADS-B")
                            {
                                queryMapped = MappedFlights.Where(a => a.AnotherFlightID == Flight.ID).SingleOrDefault();
                            }
                            if (queryMapped != null)
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
            catch (Exception ex)
            {
                return null;
            }
        }
        [HttpGet]
        public JsonResult GetMappedFlight(DateTime dt, string typ)
        {
            try
            {
                var Flights = app.Flight.Query(x => x.DateofFlight.Date == dt.Date && x.DateofFlight.Month == dt.Month && x.DateofFlight.Year == dt.Year&&x.HasPlotInCAV==1).ToList();
                var MappedFlights = app.MappedFlight.Query(a => a.TimeFrom.Date == dt.Date && a.TimeFrom.Month == dt.Month && a.TimeFrom.Year == dt.Year).ToList();
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
                        var Mapped = new MappedFlight();
                        if (typ == "SSR/MRT")
                        {
                            Mapped = MappedFlights.Where(a => a.FlightID == Flight.ID).SingleOrDefault();
                        }
                        else if (typ == "ADS-B")
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
        protected override void Dispose(bool disposing)
        {
            if (disposing) app.Dispose();
            base.Dispose(disposing);
        }
    }
}