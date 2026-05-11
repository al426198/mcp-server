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
  **Nota**: alternativamente, se puede emplear cualquier entorno de ejecución JS, como [Bun.js](https://bun.sh/) o [Deno](https://deno.com/), reemplazando los comandos pertinentes.
  
- Dependencias del proyecto:
  - **modelcontextprotocol/sdk**: *framework* utilizado
  - **zod (v4)**: validador de formato, expone el formato de petición al agente
  - **handlebars**: gestor de plantillas de generación de código
  - **dotenv**: gestor de variables de entorno (ficheros *.env*). Permite ejecutar el servidor de forma independiente.
    
- Para compilar el proyecto y ejecutar en local, será necesario instalar además:
  - **typescript**: lenguaje TypeScript
  - **types/node**: complemento de TypeScript para Node.js
  - [**typedoc**](https://typedoc.org/): generador de documentación para JavaScript/TypeScript
  - **typedoc-material-theme**: estilo visual para la documentación complementario a TypeDoc

```powershell
# Instala npm
npm install -g npm

# Versión de Node.js y npm
node -v
npm -v

# Instala las dependencias del proyecto (desde *package.json*)
npm install
```

## Configuración y uso
Antes de comenzar con la configuración, se asume que debe haber instalado un agente que soporte integraciones MCP (Claude, Copilot, etc.) en el dispositivo que actúe a modo de cliente, ya sea independiente (aplicación propia) o esté integrado en un IDE 
(como [VS Code](https://code.visualstudio.com/download) o [Google Antigravity](https://antigravity.google/download)).  

En este [listado](https://modelcontextprotocol.io/clients) se pueden ver los clientes disponibles. A priori, todos permiten el uso de herramientas (*tools*). 
Aún así, se recomienda que el agente escogido soporte también como mínimo peticiones (*prompts*) y recursos (*resources*) para no comprometer el funcionamiento de la aplicación conforme se vaya ampliando.

### Configuración
Para que el agente reconozca el servidor, es necesario acceder al fichero de configuración MCP correspondiente. Dicho fichero suele ser accesible desde los ajustes de la aplicación desde la cual se invoca al agente. 

Por ejemplo, en VS Code, la configuración MCP se encuentra en la ruta ```/.vscode/mcp.json``` desde la raíz del proyecto, mientras que en Claude se puede localizar en el fichero ```~/AppData/Local/Packages/Claude_.../LocalCache/Roaming/Claude/claude_desktop_config.json```.

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
  Se debería utilizar la última versión disponible; de no haber ninguna instalada, el código generado podría no ser compilable.
  
  En Windows, el comando correspondiente para hallar dicha ruta es:
  ```powershell
  (Get-ChildItem -Path ~/.vscode/extensions/ms-dynamics-smb.al-*/bin/win32/altool.exe | Sort-Object Name -Descending | Select-Object -First 1).FullName
  ```
  
### Ejecución en local
En cambio, si se desea ejecutar el proyecto localmente, se debe cambiar:
- La configuración propia del servidor, indicando la ruta absoluta al fichero *index.js*:
```json
  "al_codegen": {
      "command": "node",
      "args": [ "ruta/absoluta/al/servidor/src/index.js" ],
    "env": {
      "AL_PROJECT_PATH": "ruta/absoluta/al/proyecto/AL"
    }
}
```
- La variable ```AL_PROJECT_PATH```, que hace referencia a la ruta **absoluta** al proyecto AL sobre el cual se vaya a probar la aplicación, NO el proyecto destinado al servidor. Si se quiere probar el servidor manualmente, también se deberá definir en el entorno (uso de *dotenv*).

### Uso del servidor
Antes de emplear el servidor hay que comprobar que esté activo y funcionando. En VS Code se puede comprobar desde la configuración de agentes:

<img width="922" height="492" alt="image" src="https://github.com/user-attachments/assets/ce48cdc1-f338-4229-a4ac-93bd1bd1238c" />

Desde una aplicación externa (como Claude, véase abajo), se puede consultar desde el apartado "Conectores" o similar:

<img width="520" height="347" alt="image" src="https://github.com/user-attachments/assets/b3bf0e1f-24c8-46a4-a218-22acf34d8b8b" />

Una vez hecho esto, ya es posible hacer uso del servidor preguntando directamente al agente, aunque no es muy recomendable puesto que ante la falta de contexto puede saltarse algunas comprobaciones básicas como:
- La existencia de colisiones con la extensión actual (nombres e IDs de objeto).
- La compilación exitosa del código generado.

Existen 2 maneras de reducir el impacto de este problema:
- Desde el cliente, inyectando el contexto pertinente mediante ficheros "ocultos" que el agente lee en tiempo de ejecución (suelen terminar en -rules.md).
- Desde el servidor, añadir una petición a modo de guía o un recurso a modo de manual. Durante el desarrollo, se ha optado por utilizar una petición a modo de flujo de trabajo para realizar pruebas, que el usuario puede utilizar tanto desde VS Code...

<img width="350" height="232" alt="image" src="https://github.com/user-attachments/assets/a2bd3041-1c12-42bc-9c71-f6737e234b36" />

<img width="488" height="158" alt="image" src="https://github.com/user-attachments/assets/e3ba9413-b53d-40d1-b38e-dee1c6535be3" />

<img width="595" height="141" alt="image" src="https://github.com/user-attachments/assets/dd3d96dc-6824-4964-b27f-1a7ac7c24122" />

...como Claude o similares.

<img width="731" height="355" alt="image" src="https://github.com/user-attachments/assets/c7d4bcb7-11a4-4bbc-a621-afcfb3321681" />

<img width="620" height="635" alt="image" src="https://github.com/user-attachments/assets/4a341724-274c-4a63-b3f4-d30d02451688" />

### Consideraciones
Puesto que esta herramienta está pensada exclusivamente para agentes de Inteligencia Artificial (IA), se debe tener en cuenta lo siguiente:
  - Como usuario, es aconsejable hacer uso de un agente para acceder al servidor. Por tanto, es responsabilidad del usuario asegurarse de NO compartir datos personales al interactuar con dicho agente.
  - Las respuestas proporcionadas pueden variar según el modelo empleado o tener errores. Aunque se han aplicado técnicas y herramientas para reducir su aparición en gran medida, el usuario debería igualmente validar el código generado.
  - Cabe la posibilidad de que el agente desvaríe o decida no seguir los pasos propuestos (si existen alternativas que considera mejores); este hecho queda fuera del alcance del proyecto y no se puede evitar o prevenir al 100%.

## Documentación adicional
Para obtener más información sobre el funcionamiento del servidor (herramientas y formatos de petición), se puede consultar la [documentación extendida](https://al426198.github.io/mcp-server/index.html).

## Autores
<a href="https://github.com/al426198" title="Daniel Ortiz Salvador">
  <img src="https://avatars.githubusercontent.com/u/120575816?v=4" alt="Daniel Ortiz Salvador" width="120"/>
</a>
