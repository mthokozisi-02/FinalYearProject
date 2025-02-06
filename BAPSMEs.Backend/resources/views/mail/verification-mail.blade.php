<x-mail::message>
# Welcome {{ $name }}

Thank you for registering on our platform!

Please click the button below to verify your email address.

@component('mail::button', ['url' => $verificationUrl])
Verify Email
@endcomponent

If you did not create an account, no further action is required.

{{-- <x-mail::button :url="''">
Button Text
</x-mail::button> --}}

Thanks,<br>
Ore-zone
</x-mail::message>
