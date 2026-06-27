# Revelar fotos de unica vez en WhatsApp.

### ¿Alguna vez te quisiste guardar alguna foto que te envian?
Ya sea algo privado o simplemente una foto de sus actividades, ahora puedes usando este bot de WhatsApp.

# ¿Como usarlo?
## En PC
Primero deberás descargar `GIT` y `NodeJS`.
Estos los encontrarás en sus respectivas paginas oficiales.

<img src="https://skillicons.dev/icons?i=git,nodejs">

Luego, descarga el repositorio haciendo click en el boton de `<> Code` y luego `Descargar ZIP`. Descomprimelo y accede a la carpeta.  

<img src="https://files.catbox.moe/7t4jrz.png" width=300> 

Una vez en la terminal, deberás ejecutar `npm i` y esperar a que se instalen las dependencias del repositorio, deberias ver una carpeta llamada `node_modules` en los archivos (Ejecutar `ls`)
Luego de eso, ejecutar `node .` y colocar tu numero de telefono, se te enviará un codigo a tu WhatsApp al estilo de WhatsApp WEB, ingresas el codigo y ya está listo el bot.

Ahora deberás configurar el chat que recibe los mensajes usando el comando: `/set`, el chat se puede cambiar ilimitadas veces. Y ahora si, solo debes responder el mensaje, no importa el mensaje, pero debes responder a la foto.

<img src="https://raw.githubusercontent.com/zeusvault/uploads/910da3c03eee1777458893c86399cb45ba37b606/images/bfa828e42fa9401550e1ece5fbe42675ee1e0886b9a0da94f8528ba402a2c554.jpg" width=250> 

<img src="https://files.catbox.moe/7wti61.jpg" width=250>

## En Telefono
Instala la aplicación [Termux](https://play.google.com/store/apps/details?id=com.termux&hl=es_419), desde GitHub web descarga el repositorio.
Termux simula una terminal directo desde tu telefono, usa un entorno virtual como espacio pero podes darle acceso a tus archivos, sigue estos pasos para hacerlo funcionar:

### 1. Darle acceso al almacenamiento y mover el archivo a Termux.
```bash
termux-setup-storage
mv storage/downloads/AntiViewOnce.WA-main.zip .
```
### 2. Instalar NodeJS y Git
<img src="https://skillicons.dev/icons?i=git,nodejs">

```bash
pkg install nodejs
# Va a solicitar que confirmes la instalación, ingresas Y 
Y
```
Se repite el proceso con git. `pkg install git` y luego Y

### 3. Descomprimir el archivo y acceder a la zona de trabajo.
```bash
unzip AntiViewOnce.WA-main.zip
cd AntiViewOnce.WA-main
```

### 4. Instalar las dependencias.
Una vez estando dentro de AntiViewOnce.WA-main, ejecutas esto para instalar las dependencias del repositorio.
```bash
npm i 
```
Cuando vuelvas a ver, ya puedes continuar.
```bash
~/AntiViewOnce.WA-main
```

### 5. Inicializar el bot.
```bash
node .
```
Esto te va a pedir tu número de telefono, lo ingresarás bajo este formato:
```js
[prefijo][numero sin espacios] // 59895123456
```
Te llegará un codigo de vinculación, el codigo es `AGUS-AVOB`.

Deberias ver algo asi:

<img src="https://github.com/zeusvault/uploads/blob/main/images/a0a763f0a552c2310f96f4c0a2d9850feed6a8a5efac1ddf1980781cb0547af8.jpg?raw=true">

### 6. Configurar el chat donde quieres que se envien las fotos.
Puede ser cualquier chat o grupo. Una vez estés en el chat debes escribir `/set` y cuando el bot responda, ya podrás descargar las fotos de unica vez. Al usarse, el bot enviará el mensaje `"Chat configurado."`.
&nbsp;Ahora solo debes responder el mensaje, no importa el mensaje, pero debes responder a la foto.

<img src="https://raw.githubusercontent.com/zeusvault/uploads/910da3c03eee1777458893c86399cb45ba37b606/images/bfa828e42fa9401550e1ece5fbe42675ee1e0886b9a0da94f8528ba402a2c554.jpg" width=250> 

<img src="https://files.catbox.moe/7wti61.jpg" width=250>

# Cosas a tener en cuenta
- El bot va a detectar mensajes de unica vez que se hayan enviado durante la sesión, es decir, mientras estaba encendido. Aunque puede recibir mensajes viejos si ya habias establecido conexión antes con el mismo numero.