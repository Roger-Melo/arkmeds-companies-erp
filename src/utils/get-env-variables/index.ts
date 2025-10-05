export function getEnvVariable(variableName: string) {
  const variableValue = process.env[variableName];

  if (!variableValue) {
    throw new Error(`${variableName} não configurada`);
  }

  return variableValue;
}
