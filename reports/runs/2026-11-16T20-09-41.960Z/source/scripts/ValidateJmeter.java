import java.io.File;
import org.apache.jmeter.save.SaveService;
import org.apache.jmeter.assertions.JSR223Assertion;
import org.apache.jmeter.threads.ThreadGroup;
import org.apache.jmeter.util.JMeterUtils;
import org.apache.jorphan.collections.HashTree;
import org.apache.jorphan.collections.SearchByClass;

public class ValidateJmeter {
    public static void main(String[] args) throws Exception {
        JMeterUtils.setJMeterHome(args[0]);
        JMeterUtils.loadJMeterProperties(args[0] + "/bin/jmeter.properties");
        JMeterUtils.initLocale();
        HashTree tree = SaveService.loadTree(new File(args[1]));
        SearchByClass<ThreadGroup> search = new SearchByClass<>(ThreadGroup.class);
        tree.traverse(search);
        if (search.getSearchResults().size() != 2) throw new IllegalStateException("Se requieren dos grupos");
        for (ThreadGroup group : search.getSearchResults()) {
            if (group.isEnabled()) throw new IllegalStateException("Los grupos deben permanecer deshabilitados");
            System.out.println("Grupo deserializado: " + group.getName());
        }
        SearchByClass<JSR223Assertion> assertions = new SearchByClass<>(JSR223Assertion.class);
        tree.traverse(assertions);
        try (groovy.lang.GroovyClassLoader compiler = new groovy.lang.GroovyClassLoader()) {
            for (JSR223Assertion assertion : assertions.getSearchResults()) {
                compiler.parseClass(assertion.getScript());
            }
        }
        System.out.println("Asercion Groovy compilada sin ejecutar.");
        System.out.println("JMeter SaveService: plan valido. No se instancio motor ni se ejecutaron muestras.");
    }
}
