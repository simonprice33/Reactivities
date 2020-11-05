using System;
using System.Net;

namespace Application.Errors
{
    public class RestException : Exception
    {
        public HttpStatusCode Code;
        public object Error;

        public RestException(HttpStatusCode code, object error = null)
        {
            Code = code;
            Error = error;
        }
    }
}
