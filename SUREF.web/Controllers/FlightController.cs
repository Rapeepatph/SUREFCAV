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
    public class FlightController : Controller
    {
        private App app = new App();
        // GET: Flight
        public ActionResult Index()
        {
            var Flights = app.FlightView.All();
            
            return View(Flights);
        }
        [HttpGet]
        public JsonResult Get(DateTime dt)

        {
            try
            {
                var Flights = app.FlightView.Query(x=>x.DateofFlight.Date==dt.Date && x.DateofFlight.Month==dt.Month&&x.DateofFlight.Year==dt.Year).ToList();
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
                        item.TimeFrom =  Flight.TimeFrom.ToString("MM/dd/yyyy HH:mm:ss.fff ");
                        item.TimeTo = Flight.TimeTo.ToString("MM/dd/yyyy HH:mm:ss.fff ");
                        item.CreateTime = Flight.CreateTime;
                        item.ProcessRound = Flight.ProcessRound;
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
        protected override void Dispose(bool disposing)
        {
            if (disposing) app.Dispose();
            base.Dispose(disposing);
        }
    }
}