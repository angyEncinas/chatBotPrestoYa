const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowNanny = addKeyword(['Soy Nanny', 'Nanny']).addAnswer(
    [
        'Perfecto 😊Gracias a la alianza que tenemos el único requisito es que estes habilitada por Nannys para realizar el préstamo, para esto necesitamos que llenes este formulario para poder evaluar tu solicitud de préstamo 💵 ',
        'https://forms.gle/qNAT6QZNsnR8tMRw8',
        '*Será un placer ayudarte, por favor avísanos ni bien llenes el formulario y lo envies*',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)
let nombre;
let monto;
let telefono;

const flowFormulario = addKeyword(['formulario','⬅️ Volver al Inicio'])
    .addAnswer(
        ['Hola!','Para enviar el formulario necesito unos datos...' ,'Escriba su *Nombre*'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },

        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
             return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',    // Aquí terminamos el flow si la condicion se comple
                 buttons:[{body:'⬅️ Volver al Inicio' }]                      // Y además, añadimos un botón por si necesitas derivarlo a otro flow

            
            })
            nombre = ctx.body
            return flowDynamic(`Encantado *${nombre}*, continuamos...`)
        }
    )
    .addAnswer(
        ['También necesito tus dos apellidos'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },

        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud') 
                return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                    buttons:[{body:'⬅️ Volver al Inicio' }]


        })
        apellidos = ctx.body
        return flowDynamic(`Perfecto *${nombre}*, por último...`)
        }
    )
    .addAnswer(
        ['Dejeme su número de teléfono y le llamaré lo antes posible.'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },

        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud') 
                return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                      buttons:[{body:'⬅️ Volver al Inicio' }]
                })


                telefono = ctx.body
                await delay(2000)
                return flowDynamic(`Estupendo *${nombre}*! te dejo el resumen de tu formulario
                \n- Nombre y apellidos: *${nombre} ${apellidos}*
                \n- Telefono: *${telefono}*`)
        }
    )

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('¡Hola! 😊 Gracias por contactarte con PrestoYa.💸 Estamos recibiendo una alta demanda de mensajes en este momento, *por lo que te pedimos paciencia.*⚠️')
    .addAnswer('Queremos informarte que en PrestoYa realizamos microprestamos *desde 100 bs hasta 14000 bs*,🤑 con plazos flexibles que van desde *1 día hasta 2 años*.')
    .addAnswer('El *UNICO REQUISITO* que solicitamos es *contar con una garantía* que supere el monto a ser prestado. Actualmente, nos encontramos en *Cochabamba*')
    .addAnswer(
        ['Ahora atenderemos tu solicitud' ,'¿Cuál es tu nombre?'],
        { capture: true},

        async (ctx, { flowDynamic, endFlow }) => {
            nombre = ctx.body
            return flowDynamic(`Encantado *${nombre}*, comencemos...`)
        }
    )
    .addAnswer(
        ['¿Cuál es el monto que deseas solicitar?'],
        { capture: true},

        async (ctx, { flowDynamic, endFlow }) => {
            monto = ctx.body
            return flowDynamic(`Perfecto...`)
        }
    )
    .addAnswer(
        ['¿Se encuentra en la ciudad de Cochabamba?'],
        { capture: true},

        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == 'No') 
                return endFlow({body: 'Muchas gracias por esperar a que tu solicitud fuera atendida, Por el momento nos encontramos ubicados en la ciudad de  *Cochabamba*, por lo que los préstamos estan unicamente habilitados para esta ciudad le recomendamos estar atento a nuestras redes sociales y guardar nuestro número, ni bien tengamos sucursal en su ciudad se lo haremos saber. Un placer 😁'

        })
        cbba = ctx.body
        return flowDynamic(`Perfecto continuamos..`)
        }
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal,flowNanny])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
