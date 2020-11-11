using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        /// <summary>
        /// Gets or Sets the Display Name of the logged in user
        /// </summary>
        public string DisplayName { get; set; }
    }
}
