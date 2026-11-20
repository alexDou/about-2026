"""The Worker's entry: the only module that imports the Workers runtime (ADR 0006).

It turns the runtime's request into an `ApiRequest`, hands it to the route table and turns the
`ApiResponse` back. Everything behind it is plain Python that pytest runs in CPython.
"""

from urllib.parse import urlsplit

from workers import Response, WorkerEntrypoint

from app.http import ApiRequest
from app.routes import dispatch


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        api_request = ApiRequest(
            method=request.method.value,
            path=urlsplit(request.url).path,
            headers={name.lower(): value for name, value in request.headers.items()},
            body=await request.bytes(),
        )
        api_response = await dispatch(api_request)
        return Response(
            api_response.body or None,
            status=api_response.status,
            headers=dict(api_response.headers),
        )
