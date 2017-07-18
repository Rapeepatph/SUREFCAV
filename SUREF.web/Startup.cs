﻿using System;
using Microsoft.Owin;
using Owin;
using SUREF.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Linq;
using Microsoft.AspNet.Identity;

[assembly: OwinStartupAttribute(typeof(SUREF.Startup))]
namespace SUREF
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            createRolesandUsers();
        }

        private void createRolesandUsers()
        {
            ApplicationDbContext context = new ApplicationDbContext();
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            var UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            if (!roleManager.RoleExists("Admin"))
            {
                var role = new IdentityRole();
                role.Name = "Admin";
                roleManager.Create(role);
                
                string userEmail = "sysAdminSUREF@gmail.com";
                string passwd = "P@ssw0rd";
                var user = new ApplicationUser();
                user.UserName = userEmail;
                user.Email = userEmail;

                var chkUser = UserManager.Create(user, passwd);
                if (chkUser.Succeeded)
                {
                    var result = UserManager.AddToRole(user.Id, "Admin");
                }
            }
        }
    }
}