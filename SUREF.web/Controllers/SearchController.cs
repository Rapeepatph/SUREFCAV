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
    public class SearchController : Controller
    {
        private App app = new App();
        // GET: Search
        public ActionResult Index()
        {
            var Flights = app.FlightView.All().OrderByDescending(x => x.DateofFlight).ToList();
            var lastestFlight = Flights.FirstOrDefault();
            ViewBag.RecentlyDate = lastestFlight.DateofFlight.Day + "-" + lastestFlight.DateofFlight.Month + "-" + lastestFlight.DateofFlight.Year;
            return View();
        }
        [System.Web.Http.HttpGet]
        public JsonResult getFlight(DateTime dt,string int1,string int2,string int3,string int4)
        {
            var FlightsList = app.FlightView.Query(x => x.DateofFlight.Date == dt.Date && x.DateofFlight.Month == dt.Month && x.DateofFlight.Year == dt.Year && x.HasPlotInCAV == 1).ToList();
            //var Flights = FlightsList.Where(x => x.AircraftID.Contains(int1) || x.AircraftID.Contains(int2) || x.AircraftID.Contains(int3) || x.AircraftID.Contains(int4)
            //                || x.CallSign.Contains(int1.ToUpper()) || x.CallSign.Contains(int2.ToUpper()) || x.CallSign.Contains(int3.ToUpper()) || x.CallSign.Contains(int4.ToUpper())).ToList();
            var Flights = new List<FlightView>();
            if (int1!=string.Empty)
            {
                var FlightsFromInt1 = FlightsList.Where(x => x.AircraftID.Contains(int1) || x.CallSign.Contains(int1.ToUpper())).ToList();
                foreach(var item in FlightsFromInt1)
                {
                    if (!checkExist(item, Flights))
                    {
                        Flights.Add(item);
                    }
                }
                
            }
            if (int2 != string.Empty)
            {
                var FlightsFromInt2 = FlightsList.Where(x => x.AircraftID.Contains(int2) || x.CallSign.Contains(int2.ToUpper())).ToList();
                foreach (var item in FlightsFromInt2)
                {
                    if (!checkExist(item, Flights))
                    {
                        Flights.Add(item);
                    }
                }
            }
            if (int3 != string.Empty)
            {
                var FlightsFromInt3 = FlightsList.Where(x => x.AircraftID.Contains(int3) || x.CallSign.Contains(int3.ToUpper())).ToList();
                foreach (var item in FlightsFromInt3)
                {
                    if (!checkExist(item, Flights))
                    {
                        Flights.Add(item);
                    }
                }
            }
            if(int4 != string.Empty)
            {
                var FlightsFromInt4 = FlightsList.Where(x => x.AircraftID.Contains(int4) || x.CallSign.Contains(int4.ToUpper())).ToList();
                foreach (var item in FlightsFromInt4)
                {
                    if (!checkExist(item, Flights))
                    {
                        Flights.Add(item);
                    }
                }
            }
            var data = new List<FlightListViewModel>();
            if (Flights == null)
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            else
            {
                foreach (var flight in Flights)
                {
                    var item = new FlightListViewModel();
                    item.AircraftID = flight.AircraftID;
                    item.CallSign = flight.CallSign;
                    item.DateOfFlight = flight.DateofFlight;
                    item.TimeFrom = flight.TimeFrom.ToString("MM/dd/yyyy HH:mm:ss.fff ");
                    item.TimeTo = flight.TimeTo.ToString("MM/dd/yyyy HH:mm:ss.fff ");
                    item.SensorID = flight.SensorID;
                    data.Add(item);
                }
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            
        }

        private bool checkExist(FlightView item, List<FlightView> flights)
        {
            bool ans = true;
            ans = flights.Exists(x => x.ID == item.ID);
            return ans;
        }

        [HttpGet]
        public JsonResult getSensor()
        {
            var Sensors = app.SensorView.All();
            var data = new List<SensorModel>();
            if(Sensors == null)
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            else
            {
                foreach(var sensor in Sensors)
                {
                    SensorModel item = new SensorModel();
                    item.ID = sensor.ID;
                    item.Name = sensor.Name;
                    item.IP = sensor.IP;
                    item.Port = sensor.Port;
                    item.Description = sensor.Description;
                    data.Add(item);
                }
                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }
    }
}