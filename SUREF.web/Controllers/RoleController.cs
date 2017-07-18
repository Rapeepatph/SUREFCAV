using Microsoft.AspNet.Identity.EntityFramework;
using SUREF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SUREF.Controllers
{
    public class RoleController : Controller
    {
        ApplicationDbContext context;

        public RoleController()
        {
            context = new ApplicationDbContext();
        }
        /// <summary>
        /// Get All Roles
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            var Roles = context.Roles.ToList();
            return View(Roles);
        }

        /// <summary>
        /// Create  a New role
        /// </summary>
        /// <returns></returns>
        public ActionResult Create()
        {
            var Role = new IdentityRole();
            return View(Role);
        }

        /// <summary>
        /// Create a New Role
        /// </summary>
        /// <param name="Role"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Create(IdentityRole Role)
        {
            try
            {
                ViewBag.Error = "";
                context.Roles.Add(Role);
                context.SaveChanges();
                return RedirectToAction("Index");
            }
            catch
            {
                ViewBag.Error = "This Role is Already Existing.";
                return View(Role);
            }
        }
        [AllowAnonymous]
        public ActionResult Delete(string roleId)
        {
            var Role = context.Roles.Where(x => x.Id == roleId).SingleOrDefault();
            return View(Role);
        }
        [HttpPost, ActionName("Delete")]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteRole(string roleId)
        {
            var Role = context.Roles.Where(x => x.Id == roleId).SingleOrDefault();
            try
            {
                context.Roles.Remove(Role);
                context.SaveChanges();
                return RedirectToAction("Index");
            }
            catch
            {
                return View(Role);
            }
        }
        [AllowAnonymous]
        public ActionResult Edit(string roleId)
        {
            var Role = context.Roles.Where(x => x.Id == roleId).SingleOrDefault();
            return View(Role);
        }
        [HttpPost, ActionName("Edit")]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult EditRole(IdentityRole model)
        {
            if (ModelState.IsValid)
            {
                var Role = context.Roles.Where(x => x.Id == model.Id).SingleOrDefault();
                try
                {
                    Role.Name = model.Name;
                    context.SaveChanges();
                    return RedirectToAction("Index");
                }
                catch
                {
                    return View(model);
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }
    }
}