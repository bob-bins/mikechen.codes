export const log = <T>(loggable:T, ...otherText:any) => {
  try {
    console.log(JSON.stringify(loggable,null,2), otherText)
  } catch(e) {
    console.error(`Error using log(). Input is not JSON.stringifiable.\n${e}`)
  }
  return loggable
}