using CCMS.Core;
using SUREFCAV.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUREF.Services
{
    public class SensorCavService : ServiceBase<App, Sensor>
    {
        public override IRepository<Sensor> Repository { get; set; }
        public override Sensor Find(params object[] keys)
        {
            int id = (int)keys[0];
            return Query(a => a.ID == id).SingleOrDefault();
        }
    }
}
