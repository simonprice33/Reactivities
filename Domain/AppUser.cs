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

        public string Bio { get; set; }

        public virtual ICollection<UserActivity> UserActivities { get; set; }

        public virtual ICollection<Photo> Photos { get; set; }
    }
}
