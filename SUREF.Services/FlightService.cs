using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SUREF.Data.Models;
using System.Data.Entity;
using CCMS.Core;

namespace SUREF.Services
{
    public class FlightService : ServiceBase<App, FlightView>
    {
        public override IRepository<FlightView> Repository { get; set; }
        public override FlightView Find(params object[] keys)
        {
            int id = (int)keys[0];
            return Query(a => a.ID == id).SingleOrDefault();
        }

    }
    
}
