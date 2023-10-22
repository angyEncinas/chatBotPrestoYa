const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowJoyeria = addKeyword(['joyas', '1'] ,{ sensitive: true })
    .addAnswer(
        ['Perfecto👍🏼,  para poder validar tu garantía necesitamos:',
        '✅Fotos actualizadas de lo que se dejará como garantía ',
        '✅Carcteristicas de la joya: material y gramaje',
        '✅Si tiene una factura o alguna revisión dada por una joyería que certifique gramaje  y valor(Es opcional igualmente se hará revisar al momento del préstamo)'
         ]
    )
    .addAnswer(
        ['Una vez enviadas las fotos y datos que te solicitamos te haremos llegar una tabla con la/las cuotas de pago con información exacta del interés por el préstamo']
    )
const flowElectronicos = addKeyword(['electronicos','2'],{ sensitive: true })
    .addAnswer(
        ['Perfecto👍🏼,  para poder validar tu garantía necesitamos:',
        '✅Fotos actualizadas del estado actual del electrónico',
        '✅Factura de compra( opcional)',
        '✅ Características, modelo, año (si es un dispositivo electrónico enviar una foto de las especificaciones)'
        ]
    )
    .addAnswer(
        ['Una vez enviadas las fotos y datos que te solicitamos te haremos llegar una tabla con la/las cuotas de pago con información exacta del interés por el préstamo']
    )
const flowPapeles = addKeyword(['Papeles','3'],{ sensitive: true })
    .addAnswer('Queremos informarte que esta modalidad de préstamo no es tan rápida ya que se deben revisar a detalle los papeles y su validez asi que te pedimos paciencia')
        .addAnswer(
        ['Perfecto👍🏼,  para poder validar tu garantía necesitamos:',
        '✅Fotos actuales del motorizado o inmueble',
        '✅Foto de los documento que certifiquen que es el dueño de la garantía', 
        '✅ Características generales como ser: modelo, etc']
    )
    .addAnswer(
        ['Una vez enviadas las fotos y datos que te solicitamos te haremos llegar una tabla con la/las cuotas de pago con información exacta del interés por el préstamo']
    )
const flowNanny = addKeyword(['Soy Nanny'],{ sensitive: true }).addAnswer(
    [
        'Perfecto 😊Gracias a la alianza que tenemos el único requisito es que estes habilitada por Nannys para realizar el préstamo, para esto necesitamos que llenes este formulario para poder evaluar tu solicitud de préstamo 💵 ',
        'https://forms.gle/qNAT6QZNsnR8tMRw8',
        '*Será un placer ayudarte, por favor avísanos ni bien llenes el formulario y lo envies*',
    ],
    null,
    null
)
const flowJelpi = addKeyword(['Soy Jelpi'],{ sensitive: true }).addAnswer(
    [
        'Perfecto 😊Gracias a la alianza que tenemos el único requisito es que estes habilitada por Jelpi para realizar el préstamo, para esto necesitamos que llenes este formulario para poder evaluar tu solicitud de préstamo 💵 ',
        'https://forms.gle/c8BDyX1kUosSEPJV7',
        '*Será un placer ayudarte, por favor avísanos ni bien llenes el formulario y lo envies*',
    ],
    null,
    null
)

let nombre;
let monto;
let tiempo;

const flowPrincipal = addKeyword(['ole', 'alo','Hola! Quiero un préstamo 💵'],{ sensitive: true })
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
    .addAnswer(
        ['¿Por cuanto tiempo requiere el préstamo?'],
        { capture: true},

        async (ctx, { flowDynamic, endFlow }) => {
            tiempo = ctx.body
            return flowDynamic(`Perfecto registrado...`)
        }
    )
    .addAnswer(
        ['Nuestro único requisito para acceder al préstamo es contar con una garantía que supere el monto que nos solicitó','Escoja el tipo de garantia con el que cuenta','*1* Para Joyeria','*2* Para eléctronicos y objetos de valor','*3* Para Papeles de motorizado o inmueble'],
        null,null, [flowElectronicos,flowJoyeria,flowPapeles]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal,flowNanny,flowJelpi])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
