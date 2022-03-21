# Dockerizar proyecto

<i>* La versión dockerizada está muy desactualizada y solo se encuentra funcional el login y el registro</i>

Para dockerizar este proyecto se ha utilizado 2 dockerfiles gestionados con docker compose. Se ha separado el proyecto en 3 contenedores para las diferentes partes. MySql, Backend y Frontend.

## Docker Compose
Como se ha comentado anteriormente, se ha utilizado docker compose para gestionar la dockerización de este proyecto. Para ello hemos creado el docker-compose.yml en la raiz del proyecto, el cual contiene 3 contenedores.<br/>
El primero, llamado <b>db</b> va ser el contenedor en el que estará nuestro servidor de base de datos MySql. Para ello vamos a utilizar la imagen mysql y le pasaremos las variables de entorno corresponientes para que se ejecute en el puerto que queremos. Para que todos los servicios funcionen correctamente, los conectaremos en la network main que será creada al final de documento.<br/>
![compose-mysql](https://user-images.githubusercontent.com/31510870/153645295-36700425-d4a5-45b6-84b8-cc77f039f572.png)

En segundo lugar, creamos el contenedor del backend. Para ello usamos una imagen que generará el Dockerfile que se encuentra dentro del directorio ```./backend/```. Como hemos hecho anteriormente, le pasamos todas las variables de entorno necesarias y lo añadimos a la network main. En este caso le especificamos que para ser montado, debe esperar a que se monte el contenedor anterior de mysql al que hemos llamado db.<br/>
La opción <b>depends_on</b> no es suficiente, ya que el servicio de mysql tarda mas en iniciarse de lo que tarda nuestro servidor de django. Es por esto que necesitamos el script ```waitforit.sh``` que se encuentra dentro del directorio ```./backend/django_server/```. Para ejecutarlo le damos permisos de ejecución, ejecutamos el script y cuando se haya terminado la ejecución del script, significara que el servicio de mysql estará activo. Por lo tanto podremos proceder a hacer la migración de las bases de datos y a arrancar el servidor en el puerto 8000.<br>
![compose-server](https://user-images.githubusercontent.com/31510870/153645316-4cc974ae-152d-408b-937d-622e5e5acc4b.png)

Por utlimo, creamos el contenedor del frontend. Para ello usamos la imagen que generará el Dockerfile que se encuentra dentro del directoro ```./forntend/```.
En este caso solo necesitamos la variable de entorno del puerto en el que queremos que se ejecute.<br/>
Le especificamos que se ejecute el comando ```npm install``` para instalar todas las dependencias y posteriormente que se ejecute el comando ```npm start``` para arrancar el servicio de React. Como hemos hecho en el servidor, debemos especificarle que se ejecutará una vez este montado el servidor.<br>
![compose-app](https://user-images.githubusercontent.com/31510870/153645833-9018ce26-4014-4757-a705-064f14e1e176.png)

Como se puede observar en la ultima captura, al final del documento creamos la network main.

## Dockerfile Backend
Como ya hemos adelantado anteriormente, para crear el contenedor del servidor de Django necesitamos un Dockerfile que se encuentra dentro del directorio ```./backend/```.<br>
En este Dockerfile usamos la imagen de python con la versión 3.8.10. Especificamos que se trabajará dentro de un directorio backend y copiamos a este todo el directorio de nuestro servidor de django. A continuación instalamos todas las dependencias que se encuentran en nustro ```requirements.txt``` y exponemos el puerto 8000 que es el que usa Django para ejecutarse.<br>
![dockerfile-backend](https://user-images.githubusercontent.com/31510870/153646511-a7dc169c-63c8-4a37-a581-7cbcb5f6d097.png)

Es necesario que en el ```settings.py``` de nuestro servidor de Django, pongamos correctamente las variables de entorno para que se conecte a nuestro contenedor de mysql.<br>
![settingsDB](https://user-images.githubusercontent.com/31510870/153646759-5659c8b7-61cf-4201-956c-14711d06daa4.png)

## Dockerfile Frontend
Como ya hemos adelantado anteriormente, para crear el contenedor del cliente de React necesitamos un Dockerfile que se encuentra dentro del directorio ```./frontend/```.<br>
En este Dockerfile, usamos la imagen de node en la versión 14.18.3. Especificamos que trabajaremos dentro del directorio frontend, y copiamos ahi todos los archivos de nuestro frontend. Finalmente exponemos el puerto 8080 que usa React para ejecutarse.<br>
![dockerfile-frontend](https://user-images.githubusercontent.com/31510870/153647149-e9c92300-6c8a-4c36-9cc4-509eddaa0d68.png)

Para comprobar que esta funcionando entramos a http://localhost:8080 y nos deberá salir el login de la aplicación.
