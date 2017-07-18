using CCMS.Core;
using SUREFCAV.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUREF.Services
{
    public class FlightCavService : ServiceBase<App,Flight>
    {
        public override IRepository<Flight> Repository { get; set; }
        public override Flight Find(params object[] keys)
        {
            int id = (int)keys[0];
            return Query(a => a.ID == id).SingleOrDefault();
        }
    }
}
