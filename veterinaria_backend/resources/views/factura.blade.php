<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    {{-- @vite('resources/css/app.css') --}}
    {{-- <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" /> --}}
    <title>Document</title>
    <style>
        /* Estilos generales */
        /*! tailwindcss v2.2.19 | MIT License | https://tailwindcss.com *//*! modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */*,::after,::before{box-sizing:border-box}html{-moz-tab-size:4;tab-size:4}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'}hr{height:0;color:inherit}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}::-moz-focus-inner{border-style:none;padding:0}:-moz-focusring{outline:1px dotted ButtonText}:-moz-ui-invalid{box-shadow:none}legend{padding:0}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}button{background-color:transparent;background-image:none}fieldset{margin:0;padding:0}ol,ul{list-style:none;margin:0;padding:0}html{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";line-height:1.5}body{font-family:inherit;line-height:inherit}*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:currentColor}hr{border-top-width:1px}img{border-style:solid}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:-moz-focusring{outline:auto}table{border-collapse:collapse}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}button,input,optgroup,select,textarea{padding:0;line-height:inherit;color:inherit}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,::after,::before{--tw-border-opacity:1;border-color:rgba(229,231,235,var(--tw-border-opacity))}
        .container {
            width: 100%;
            padding-right: 1rem;
            padding-left: 1rem;
            margin-right: auto;
            margin-left: auto;
        }
    
        .mx-auto {
            margin-right: auto;
            margin-left: auto;
        }
    
        .p-4 {
            padding: 1rem;
        }
    
        .w-4\/5 {
            width: 80%;
        }
    
        .w-full{width:100%}
        .bg-white {
            background-color: #fff;
        }
    
        .shadow-lg {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    
        .rounded-lg {
            border-radius: 0.5rem;
        }
    
        .overflow-hidden {
            overflow: hidden;
        }
    
        .px-6 {
            padding-right: 1.5rem;
            padding-left: 1.5rem;
        }
    
        .py-4 {
            padding-top: 1rem;
            padding-bottom: 1rem;
        }
    
        .bg-gray-100 {
            background-color: #f3f4f6;
        }
    
        .px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}
    
        .flex {
            display: flex;
        }
    
        .justify-between {
            justify-content: space-between;
        }
    
        .items-center {
            align-items: center;
        }
    
        .mb-4 {
            margin-bottom: 1rem;
        }
    
        .text-2xl {
            font-size: 1.5rem;
        }
    
        .font-bold {
            font-weight: 700;
        }
    
        .text-black-500 {
            color: #374151;
        }
    
        .text-right {
            text-align: right;
        }
    
        .italic {
            font-style: italic;
        }
    
        .divide-y>:not([hidden])~:not([hidden]){--tw-divide-y-reverse:0;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px * var(--tw-divide-y-reverse))}
    
        .divide-blue-500>:not([hidden])~:not([hidden]){--tw-divide-opacity:1;border-color:rgba(59,130,246,var(--tw-divide-opacity))}
    
        .divide-white>:not([hidden])~:not([hidden]){--tw-divide-opacity:1;border-color:rgba(255,255,255,var(--tw-divide-opacity))}
        .mt-2 {
            margin-top: 0.5rem;
        }
    
        .w-1\/2 {
            width: 50%;
        }
    
        .text-3xl {
            font-size: 1.875rem;
        }
    
        .text-blue-500 {
            color: #3b82f6;
        }
    
        .date {
            font-size: 0.875rem;
        }
    
        .py-3 {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
        }
    
        .bg-blue-100 {
            background-color: #ebf8ff;
        }
    
        .border-l-4 {
            border-left-width: 0.25rem;
            border-left-color: #2563eb;
        }
    
        .text-blue-700 {
            color: #2563eb;
        }
        .bg-blue-500{--tw-bg-opacity:1;background-color:rgba(59,130,246,var(--tw-bg-opacity))}

        .bg-gray-100{--tw-bg-opacity:1;background-color:rgba(243,244,246,var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgba(229,231,235,var(--tw-bg-opacity))}
    
        .border-t {
            border-top-width: 1px;
            border-color: rgba(229, 231, 235);
        }
    
        .pt-4 {
            padding-top: 1rem;
        }
    
        .mt-4 {
            margin-top: 1rem;
        }
        .w-24{width:6rem}
        .text-center{text-align:center}
        .text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}
    
        /* Agregar más estilos según sea necesario */
    
    </style>
    

</head>

<body>
    <div class="container mx-auto ">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="px-6 py-4">
                <div class="bg-gray-100 px-4">
                    <div class="flex justify-between  items-center mb-4">
                        <div>
                            <img src="https://firebasestorage.googleapis.com/v0/b/apexcharts-graphics.appspot.com/o/images%2Flogo.jpg?alt=media&token=522d647e-b97a-462b-9391-3fd7b37399b7"
                                width="100" alt="pozovet">
                        </div>
                        <div class="w-3/4 text-right">
                            <h2 class="text-2xl font-bold">POZOVET</h2>
                            <div class="text-black-500">1251470366001</div>
                            <div class="text-black-500">calle 15, avenida 10</div>
                            <div class="italic">0969798959</div>
                            <div><a href="pozovet@gmail.com">pozovet@gmail.com</a></div>
                        </div>
                    </div>
                    <div class="divide-y divide-blue-500">
                        <div>

                        </div>
                        <div class="flex justify-between  items-center mb-4 mt-2">
                            <div class="w-1/2">
                                <div class="text-gray-light font-bold">CLIENTE:</div>
                                <h2 class="">{{ $datosFactura->transaccion->client->nombres }}
                                    {{ $datosFactura->transaccion->client->apellidos }}</h2>
                                <div class="address">
                                    {{ $datosFactura->transaccion->client->direccion ? $datosFactura->transaccion->client->direccion : 'direccion anonima' }}
                                </div>
                                <div class="text-blue-500"><a
                                        href="{{ $datosFactura->transaccion->client->email }}">{{ $datosFactura->transaccion->client->email }}</a>
                                </div>
                                <div class="italic">
                                    {{ $datosFactura->transaccion->client->telefono_uno ? $datosFactura->transaccion->client->telefono_uno : $datosFactura->transaccion->client->telefono_dos }}
                                </div>
                            </div>
                            <div class="w-1/2 text-right">
                                <h1 class="text-3xl font-bold text-blue-500">Factura N° {{ $datosFactura->numero }}</h1>
                                <div class="date">Emision: {{ $datosFactura->fecha_emision }}</div>
                                <div class="date">Vencimiento: {{ $datosFactura->vencimiento }}</div>
                                <div>{{ $datosFactura->estado }}</div>
                            </div>
                        </div>

                    </div>
                </div>
                <table class="w-full mb-4 ">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="w-8">#</th>
                            <th class="px-4 py-2 text-left">Producto</th>
                            <th class="px-3 py-2 text-right w-24">Precio</th>
                            <th class="px-2 py-2 text-right w-24 ">Cantidad</th>
                            <th class="px-3 py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody class="bg-gray-100 divide-y divide-white">
                        @foreach ($datosFactura->transaccion->transactionDetail as $detalle)
                            <tr class="space-y-6">
                                <td class="text-center text-white bg-blue-500 w-8">{{ $loop->iteration }}</td>
                                <td class="px-4 py-3 text-blue-500 font-mono text-2xl">{{ $detalle->product->nombre }}
                                </td>
                                <td class="px-3 py-3 bg-gray-200 text-right w-24">$ {{ $detalle->product->pvp }}</td>
                                <td class="px-2 py-3 text-right w-24">{{ $detalle->cantidad }}</td>
                                <td class="px-3 py-3 text-right text-white bg-blue-500">$ {{ $detalle->total }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2"></td>
                            <td class="text-right" colspan="2">SUBTOTAL</td>
                            <td class="text-right py-3">$ {{ $datosFactura->subtotal }}</td>
                        </tr>
                        <tr class="divide-y">
                            <td colspan="2"></td>
                            <td class="text-right" colspan="2">IVA 15%</td>
                            <td class="text-right py-3">$ {{ $datosFactura->iva }}</td>
                        </tr>
                        <tr class="divide-y divide-blue-500 ">
                            <td colspan="2"></td>
                            <td class="text-right" colspan="2">GRAND TOTAL</td>
                            <td class="text-right py-3">$ {{ $datosFactura->total }}</td>
                        </tr>
                    </tfoot>
                </table>
                <div class="text-2xl font-bold text-right mb-4">gracias!</div>
                <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
                    <div class="font-bold">NOTA:</div>
                    <div class="notice">Esto es una factura provisional.</div>
                </div>
                <footer class="text-center border-t border-gray-300 pt-4 mt-4">factura generada por
                    {{ $datosFactura->user->name }}</footer>
            </div>
        </div>
    </div>
</body>

</html>
