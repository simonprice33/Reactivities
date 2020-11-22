using Application.Photos;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Api.Controllers
{
    public class PhotosController : BaseController
    {
        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]

        public async Task<ActionResult<Photo>> Add([FromForm] Add.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = "Bearer")]

        public async Task<ActionResult<Unit>> Delete(string id)
        {
            return await Mediator.Send(new Delete.Command { PhotoId = id });
        }

        [HttpPost("{id}/setmain")]
        [Authorize(AuthenticationSchemes = "Bearer")]

        public async Task<ActionResult<Unit>> Update(string id)
        {
            return await Mediator.Send(new SetMain.Command { PhotoId = id });
        }
    }
}
