using MediatR;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }

            public string Title { get; set; }

            public string Description { get; set; }

            public string Category { get; set; }

            public DateTime? Date { get; set; }

            public string City { get; set; }

            public string Venue { get; set; }
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
                var originalEntityObject =
                    await _context.Activities.FindAsync(request.Id).ConfigureAwait(false);

                if (originalEntityObject == null)
                {
                    throw new NullReferenceException("Database Record Not Found");
                }

                originalEntityObject.Title = request.Title ?? originalEntityObject.Title;
                originalEntityObject.Description = request.Description ?? originalEntityObject.Description;
                originalEntityObject.Category = request.Category ?? originalEntityObject.Category;
                originalEntityObject.Date = request.Date ?? originalEntityObject.Date;
                originalEntityObject.City = request.City ?? originalEntityObject.City;
                originalEntityObject.Venue = request.Venue ?? originalEntityObject.Venue;

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
