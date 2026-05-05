# Desarrollo de un servidor MCP para Laberit Sistemas S.L.

## Contenidos
- [Descripción breve del proyecto](#descripción-breve-del-proyecto)  
- [Requisitos de instalación](#requisitos-de-instalación)
- [Configuración y uso](#configuración-y-uso)

## Descripción breve del proyecto
El objetivo del proyecto consiste en planificar y desarrollar un servidor MCP que permita generar código AL, permitiendo a los desarrolladores aumentar su eficiencia sin necesidad de abandonar su entorno habitual de trabajo.   
Para ello, se ha optado por emplear el lenguaje TypeScript y el SDK correspondiente proporcionado por el repositorio oficial dedicado al protocolo con el fin de desarrollar una versión "estándar" que además fuera fácilmente integrable y escalable.

## Requisitos de instalación
- [Node.js](https://nodejs.org/es/download) (v16.0+; el desarrollo se ha realizado en la v24.14.1).  
  **Nota**: alternativamente, se puede emplear cualquier entorno de ejecución JS, como [Bun.js](https://bun.sh/) o [Deno](https://deno.com/).
- Dependencias del proyecto:
  - **modelcontextprotocol/sdk**: *framework* utilizado
  - **zod (v4)**: validador de formato, expone el formato de petición al agente
  - **handlebars**: gestor de plantillas de generación de código
  - **typedoc-material-theme**: estilo visual para la documentación complementario a [TypeDoc](https://typedoc.org/)
- Para compilar el proyecto y ejecutar en local, será necesario instalar además:
  - **typescript**: lenguaje TypeScript
  - **types/node**: complemento de TypeScript para Node.js
  - **typedoc**: generador de documentación para JavaScript/TypeScript (véase el enlace superior)
  - **dotenv**: gestor de variables de entorno (ficheros *.env*)

```powershell
# Instala npm
npm install -g npm

# Versión de Node.js y npm
node -v
npm -v

# Instala las dependencias regulares
npm install

# Instala también las dependencias de desarrollo
npm install --include=dev
```

## Configuración y uso
Antes de comenzar con la configuración, se asume que debe haber instalado un agente que soporte integraciones MCP (Copilot, Claude, etc.) en el dispositivo, ya sea independiente o esté integrado en un IDE 
(como [VS Code](https://code.visualstudio.com/download) o [Google Antigravity](https://antigravity.google/download), que permita interactuar con el servidor.  
En este [listado](https://modelcontextprotocol.io/clients) se pueden ver todos los agentes disponibles, que soportan el uso de herramientas (*tools*). 
Se recomienda que el agente escogido soporte también peticiones (*prompts*) y recursos (*resources*) para no comprometer el funcionamiento de la aplicación conforme se vaya ampliando.

### Configuración
Para que el agente reconozca el servidor, es necesario acceder al fichero de configuración MCP correspondiente. 
En VS Code, se encuentra en la ruta ```~/.vscode/mcp.json```, mientras que si el agente no está integrado, la ruta dependerá de la carpeta de instalación. 

#### Ejecución en remoto (recomendada)
Dentro de la clave de configuración para MCP en dicho fichero (cuyo nombre debería ser "servers", "mcpServers" o similar), añadir lo siguiente:
```json
"al_codegen": {
      "command": "npx",
      "args": [
    "-y",
    "github:al426198/mcp-server"
  ],
  "env": {
    "AL_PROJECT_PATH": "./"
  }
},
"al-object-id-ninja": {
  "command": "npx",
  "args": [
    "-y",
    "@vjeko.com/al-object-id-ninja-mcp"
  ]
},
"al": {
  "command": "ruta/a/la/extensión/AL/bin/win32/altool.exe",
  "args": ["launchmcpserver", "--transport", "stdio"]
}
```
- El primer servidor se corresponde con este proyecto.
- El segundo servidor pertenece a AL Object ID Ninja, es una utilidad para obtener IDs de objeto evitando colisiones.
- El tercer servidor sirve para interactuar con BC, y viene incluido en la [extensión para el lenguaje AL](https://marketplace.visualstudio.com/items?itemName=ms-dynamics-smb.al) a partir de la 17.0 (Business Central 2026 Release Wave 1).
  Se debería utilizar la última versión disponible; de no haber ninguna instalada, el código generado podría contener errores de compilación.

  La ruta necesaria se puede obtener mediante el comando:
  ```powershell
  (Get-ChildItem -Path ~/.vscode/extensions/ms-dynamics-smb.al-*/bin/win32/altool.exe | Sort-Object Name -Descending | Select-Object -First 1).FullName
  ```

  **Nota**: se asume que el desarrollador trabaja en un entorno Windows, para Linux o macOS se debería reemplazar el comando para ejecutar el servidor MCP para AL por uno equivalente o insertar la ruta a mano.

### Ejecución en local
Si se desea ejecutar el servidor localmente, se debe cambiar:
- La configuración propia, indicando la ruta absoluta al fichero *index.js*:
```json
  "al_codegen": {
      "command": "node",
      "args": [ "ruta/absoluta/al/servidor/src/index.js" ],
    "env": {
      "AL_PROJECT_PATH": "./"
    }
}
```
- La variable ```AL_PROJECT_PATH```, que hace referencia a la ruta **absoluta** al proyecto AL sobre el cual se vaya a probar la aplicación, NO el proyecto destinado al servidor.

### Uso del servidor
Antes de emplear el servidor hay que comprobar que esté activo y funcionando. En VS Code se puede comprobar desde la configuración de agentes:
<img width="922" height="492" alt="image" src="https://github.com/user-attachments/assets/ce48cdc1-f338-4229-a4ac-93bd1bd1238c" />

Desde una aplicación externa (como Claude, véase abajo), se puede consultar desde el apartado "Conectores" o similar:
<img width="782" height="520" alt="image" src="https://github.com/user-attachments/assets/b3bf0e1f-24c8-46a4-a218-22acf34d8b8b" />

Una vez hecho esto, se puede emplear el servidor directamente preguntando al agente, aunque no es muy recomendable puesto que el agente puede saltarse las comprobaciones básicas como:
- Comprobar que el objeto que se va a generar no existe
- Comprobar que el ID y en consecuencia habrá errores en el código obtenido.
La opción más






### Consideraciones
Puesto que esta herramienta está pensada exclusivamente para agentes de Inteligencia Artificial (IA), se debe tener en cuenta lo siguiente:
  - Las respuestas proporcionadas pueden variar según el modelo empleado o tener errores. Aunque se han aplicado técnicas y herramientas para reducir su aparición en gran medida, el usuario debería igualmente validar el código generado.
  - Es responsabilidad del usuario asegurarse de NO compartir datos personales al interactuar con dicho agente.
  - Cabe la posibilidad de que el agente desvaríe o decida no seguir los pasos propuestos (si existen alternativas que considera mejores); este hecho queda fuera del alcance del proyecto y no se puede evitar o prevenir al 100%.

## Autores
<a href="https://github.com/al426198" title="Daniel Ortiz Salvador">
  <img src="https://avatars.githubusercontent.com/u/120575816?v=4" alt="Daniel Ortiz Salvador" width="120"/>
</a>
