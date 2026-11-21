"""The Worker's entry: the only module that imports the Workers runtime (ADR 0006).

It turns the runtime's request into an `ApiRequest`, hands it to the route table and turns the
`ApiResponse` back. Everything behind it is plain Python that pytest runs in CPython.
"""

from datetime import UTC, datetime
from urllib.parse import urlsplit

from js import Object
from pyodide.ffi import to_js
from workers import Response, WorkerEntrypoint

from app.contact.human_check import AltchaHumanCheck
from app.contact.mailer import EmailMailer
from app.dependencies import Dependencies
from app.http import ApiRequest
from app.routes import dispatch


class EmailBindingAdapter:
    """The `send_email` binding takes a JavaScript object: this hands it the message as one."""

    def __init__(self, binding):
        self._binding = binding

    async def send(self, message):
        return await self._binding.send(to_js(message, dict_converter=Object.fromEntries))


class Default(WorkerEntrypoint):
    def dependencies(self) -> Dependencies:
        mailer = EmailMailer(
            binding=EmailBindingAdapter(self.env.EMAIL),
            sender=self.env.MAIL_FROM,
            recipient=self.env.MAIL_TO,
        )

        def clock() -> datetime:
            return datetime.now(UTC)

        human_check = AltchaHumanCheck(hmac_key=self.env.ALTCHA_HMAC_KEY, clock=clock)
        return Dependencies(mailer=mailer, human_check=human_check, clock=clock)

    async def fetch(self, request):
        api_request = ApiRequest(
            method=request.method.value,
            path=urlsplit(request.url).path,
            headers={name.lower(): value for name, value in request.headers.items()},
            body=await request.bytes(),
        )
        api_response = await dispatch(api_request, self.dependencies())
        return Response(
            api_response.body or None,
            status=api_response.status,
            headers=dict(api_response.headers),
        )
