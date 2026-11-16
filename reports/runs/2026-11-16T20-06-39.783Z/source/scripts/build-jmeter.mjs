import { writeFileSync } from 'node:fs';

const prop = (name, value, type = 'string') => `<${type}Prop name="${name}">${value}</${type}Prop>`;
const parameter = (name, fallback) => '${__P(' + name + ',' + fallback + ')}';
const group = (id, title, users, ramp, loops) => `
<ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="${title}" enabled="false">
  ${prop('ThreadGroup.on_sample_error', 'continue')}
  <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Iteraciones por usuario">
    ${prop('LoopController.continue_forever', 'false', 'bool')}
    ${prop('LoopController.loops', parameter(id + '.loops', loops))}
  </elementProp>
  ${prop('ThreadGroup.num_threads', parameter(id + '.users', users))}
  ${prop('ThreadGroup.ramp_time', parameter(id + '.ramp', ramp))}
  ${prop('ThreadGroup.scheduler', 'false', 'bool')}
</ThreadGroup><hashTree>
  <ConstantTimer guiclass="ConstantTimerGui" testclass="ConstantTimer" testname="Pausa 1000 ms" enabled="true">${prop('ConstantTimer.delay', '1000')}</ConstantTimer><hashTree/>
  <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="${id} - consultar movimientos" enabled="true">
    <elementProp name="HTTPsampler.Arguments" elementType="Arguments"><collectionProp name="Arguments.arguments"/></elementProp>
    ${prop('HTTPSampler.path', '/parabank/services/bank/accounts/' + parameter('accountId', 0) + '/transactions')}
    ${prop('HTTPSampler.method', 'GET')}${prop('HTTPSampler.follow_redirects', 'false', 'bool')}${prop('HTTPSampler.use_keepalive', 'true', 'bool')}
  </HTTPSamplerProxy><hashTree/>
</hashTree>`;

writeFileSync('performance/parabank.jmx', `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3"><hashTree>
<TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="ParaBank - consulta de movimientos" enabled="true">
  ${prop('TestPlan.comments', 'No ejecutado. Grupos deshabilitados. Solo instancia propia autorizada.')}
  ${prop('TestPlan.serialize_threadgroups', 'true', 'bool')}
  <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="Variables"><collectionProp name="Arguments.arguments"/></elementProp>
</TestPlan><hashTree>
  <ConfigTestElement guiclass="HttpDefaultsGui" testclass="ConfigTestElement" testname="Destino autorizado" enabled="true">
    <elementProp name="HTTPsampler.Arguments" elementType="Arguments"><collectionProp name="Arguments.arguments"/></elementProp>
    ${prop('HTTPSampler.domain', parameter('host', 'localhost'))}${prop('HTTPSampler.port', parameter('port', 8080))}${prop('HTTPSampler.protocol', parameter('protocol', 'http'))}
    ${prop('HTTPSampler.connect_timeout', '10000')}${prop('HTTPSampler.response_timeout', '15000')}
  </ConfigTestElement><hashTree/>
  <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="JSON" enabled="true"><collectionProp name="HeaderManager.headers"><elementProp name="Accept" elementType="Header">${prop('Header.name', 'Accept')}${prop('Header.value', 'application/json')}</elementProp></collectionProp></HeaderManager><hashTree/>
  <ResponseAssertion guiclass="AssertionGui" testclass="ResponseAssertion" testname="HTTP 200 exacto" enabled="true">
    <collectionProp name="Asserion.test_strings">${prop('49586', '200')}</collectionProp>
    ${prop('Assertion.test_field', 'Assertion.response_code')}${prop('Assertion.assume_success', 'false', 'bool')}${prop('Assertion.test_type', '8', 'int')}
  </ResponseAssertion><hashTree/>
  <JSR223Assertion guiclass="TestBeanGUI" testclass="JSR223Assertion" testname="Contrato y pertenencia de movimientos" enabled="true">
    ${prop('scriptLanguage', 'groovy')}${prop('cacheKey', 'true')}${prop('filename', '')}
    <stringProp name="script"><![CDATA[
try {
  def body = new groovy.json.JsonSlurper().parseText(prev.getResponseDataAsString())
  assert body instanceof List
  def accountId = props.getProperty('accountId', '0').toInteger()
  assert accountId > 0 : 'Configure una cuenta propia existente'
  body.each { movement ->
    assert movement.accountId == accountId
    assert movement.id instanceof Number
    assert movement.amount instanceof Number
    assert movement.type in ['Debit', 'Credit']
  }
} catch (Throwable error) {
  AssertionResult.setFailure(true)
  AssertionResult.setFailureMessage(error.toString())
}
]]></stringProp>
  </JSR223Assertion><hashTree/>
  ${group('base', 'Escenario 1 - carga base', 5, 10, 3)}
  ${group('incremental', 'Escenario 2 - carga incremental', 10, 30, 5)}
  <ResultCollector guiclass="SummaryReport" testclass="ResultCollector" testname="Resumen por escenario" enabled="true">
    ${prop('ResultCollector.error_logging', 'false', 'bool')}
    <objProp><name>saveConfig</name><value class="SampleSaveConfiguration">
      <time>true</time><latency>true</latency><timestamp>true</timestamp><success>true</success><label>true</label><code>true</code><message>true</message><threadName>true</threadName>
      <dataType>true</dataType><encoding>false</encoding><assertions>true</assertions><subresults>false</subresults><responseData>false</responseData><samplerData>false</samplerData>
      <xml>false</xml><fieldNames>true</fieldNames><responseHeaders>false</responseHeaders><requestHeaders>false</requestHeaders><responseDataOnError>false</responseDataOnError>
      <saveAssertionResultsFailureMessage>true</saveAssertionResultsFailureMessage><assertionsResultsToSave>0</assertionsResultsToSave>
      <bytes>true</bytes><sentBytes>true</sentBytes><threadCounts>true</threadCounts><idleTime>true</idleTime><connectTime>true</connectTime>
    </value></objProp>${prop('filename', '')}
  </ResultCollector><hashTree/>
</hashTree></hashTree></jmeterTestPlan>`);
console.log('Plan generado sin ejecutar JMeter ni realizar solicitudes.');
