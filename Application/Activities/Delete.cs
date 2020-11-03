using FluentValidation;
using MediatR;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class CommandValidator : AbstractValidator<Delete.Command>
        {
            private readonly DataContext _context;

            public CommandValidator(DataContext contex)
            {
                _context = contex;
                RuleFor(query => query.Id).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var entityToDelete = await _context.Activities.FindAsync(request.Id).ConfigureAwait(false);

                if (entityToDelete == null)
                {
                    throw new NullReferenceException("Database record not found");
                }

                _context.Remove(entityToDelete);

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (success)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem saving changes");
            }
        }

    }
}
