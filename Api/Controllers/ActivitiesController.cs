using Application.Activities;
using Application.Activities.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Api.Controllers
{
    public class ActivitiesController : BaseController
    {
        [HttpGet]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<List<ActivityDto>>> List(CancellationToken cancellationToken)
        {
            return await Mediator.Send(new List.Query(), cancellationToken);
        }

        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<ActivityDto>> Detail(Guid id, CancellationToken cancellationToken)
        {
            return await Mediator.Send(new Details.Query { Id = id }, cancellationToken);
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<Unit>> Create([FromBody] Create.Command command, CancellationToken cancellationToken)
        {
            return await Mediator.Send(command, cancellationToken);
        }

        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = "Bearer", Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Edit(Guid id, [FromBody] Edit.Command command, CancellationToken cancellationToken)
        {
            command.Id = id;
            return await Mediator.Send(command, cancellationToken);
        }

        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = "Bearer", Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id, CancellationToken cancellationToken)
        {
            return await Mediator.Send(new Delete.Command { Id = id }, cancellationToken);
        }

        [HttpPost("{id}/attend")]
        [Authorize(AuthenticationSchemes = "Bearer", Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            return await Mediator.Send(new Attend.Command { Id = id }, CancellationToken.None);
        }

        [HttpDelete("{id}/attend")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<Unit>> Unattend(Guid id)
        {
            return await Mediator.Send(new Unattend.Command { Id = id }, CancellationToken.None);
        }
    }
}
