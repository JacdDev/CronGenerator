# CronGenerator
Plugin jQuery que renderiza una interfaz para generar expresiones Cron

## Requisitos
CronGenerator tiene las siguientes dependencias que deben ser incluidas
en nuestro HTML para utilizar el plugin:
* jQuery 3.4.1
* Boostrap 4.3.1
* FontAwesome 5.7.0

## Uso
Tras incluir las referencias necesarias, simplemente selecciona un elemento
jQuery y realiza una llamada a la función ```cronGenerator()```
```javascript
$("#myDiv").cronGenerator();
```
Puedes encontrar un ejemplo completo en [index.html](index.html)

## Parámetros
Puedes editar algunas opciones de la interfaz enviando parámetros a la función,
por ejemplo:
 ```javascript
$("#myDiv").cronGenerator({
    months : {
        includeValue: true,
        initialValue: '*/2',
        allowConfigure  : false,
    },
    width : '50%',
    showValueElement: false,
});
```
Los parámetros permitidos con sus valores por defecto son los siguientes:
```
seconds : {
    includeValue: true,     //Indica si incluir el valor del componente 'Segundos'
    initialValue: '*',      //Valor inicial del componente 'Segundos'
    allowConfigure  : true, //Indica si mostrar el configurador del componente 'Segundos'
},
minutes : {
    includeValue: true,     //Indica si incluir el valor del componente 'Minutos'
    initialValue: '*',      //Valor inicial del componente 'Minutos'
    allowConfigure  : true, //Indica si mostrar el configurador del componente 'Minutos'
},
hours : {
    includeValue: true,     //Indica si incluir el valor del componente 'Horas'
    initialValue: '*',      //Valor inicial del componente 'Horas'
    allowConfigure  : true, //Indica si mostrar el configurador del componente 'Horas'
},
days : {
    includeValue: true,     //Indica si incluir el valor del componente 'Días'
    initialValue: '*',      //Valor inicial del componente 'Días'
    allowConfigure  : true, //Indica si mostrar el configurador del componente 'Días'
},
daysOfWeek : {
    includeValue: true,     //Indica si incluir el valor del componente 'Días de la semana'
    initialValue: '*',      //Valor inicial del componente 'Días de la semana'
    allowConfigure  : true, //Indica si mostrar el configurador del componente 'Días de la semana'
},
months : {
    includeValue: true,     //Indica si incluir el valor del componente 'Meses'
    initialValue: '*',      //Valor inicial del componente 'Meses'
    allowConfigure  : true, //Indica si mostrar el configurador del componente 'Meses'
},
years : {
    includeValue: true,     //Indica si incluir el valor del componente 'Años'
    initialValue: '*',      //Valor inicial del componente 'Años'
    allowConfigure  : true, //Indica si mostrar el configurador del componente 'Años'
},
width : '100%',             //Anchura de la interfaz
showValueElement: true,     //Indica si mostrar un componente con el valor de la exporesión Cron generada
```

## Funciones
Puedes realizar llamadas a algunas funciones para obtener información sobre la inferfaz una vez generada,
por ejemplo:
```javascript
$("#myDiv").cronGenerator();
...
var cronGenerator = $("#myDiv").cronGenerator("getCronGenerator");
```
CronGenerator soporta las siguientes funciones:
* getCronGenerator

    Devuelve la instancia de cronGenerator asociada al elemento jQuery
```javascript 
    var cronGenerator = $("#myDiv").cronGenerator("getCronGenerator");
```

* getValue

    Devuelve el valor de la expresion Cron generada

    También es posible devolver el valor de un componente indicándolo en la llamada de la función,
    los valores permitidos son seconds, minutes, hours, days, months, daysOfWeek, years

```javascript 
    var cronExpression = $("#myDiv").cronGenerator("getValue");
```

```javascript 
    var daysExpression = $("#myDiv").cronGenerator("getValue", "days");
```