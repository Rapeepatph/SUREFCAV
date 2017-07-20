using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SUREF.Models
{
    public class EditUserModel
    {
        public string id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }

        public string   Role { get; set; }
    }

    //public class Role
    //{
    //    public string Id { get; set; }
    //    public string Name { get; set; }
    //}
}