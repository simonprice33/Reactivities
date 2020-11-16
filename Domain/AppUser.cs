using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        /// <summary>
        /// Gets or Sets the Display Name of the logged in user
        /// </summary>
        public string DisplayName { get; set; }

        public ICollection<UserActivity> UserActivities { get; set; }
    }
}
