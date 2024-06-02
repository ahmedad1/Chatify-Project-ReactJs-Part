import tryActiveTokens from "./tryActiveTokens";

async function TryToReconnectToSignalR(conn){
    try {
        await conn.start();
        return true
      } catch (e) {
        if (e.toString().includes("Status code '401'")) {
          let result = await tryActiveTokens();
          if (!result) {
              console.clear();
            return false
           
          }
          await TryToReconnectToSignalR();
        }
        else{
            return null
        }
      }
}
export default TryToReconnectToSignalR