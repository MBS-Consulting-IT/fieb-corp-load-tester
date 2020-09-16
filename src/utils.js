export const parsePayloadToXml = json => {
  const fields = json.values.reduce((xml, { name, value }) => {
    xml += `<${name}><![CDATA[${value}]]></${name}>`
    return xml
  }, '')

  return `<form>${fields}</form>`
}
