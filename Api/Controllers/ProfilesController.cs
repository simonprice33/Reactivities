using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

namespace Api.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<Profile>> Get(string username)
        {
            return await Mediator.Send(new Details.Query { Username = username });
        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<Unit>> Put(Update.Command command)
        {
            return await Mediator.Send(command, CancellationToken.None);
        }

    }
}
