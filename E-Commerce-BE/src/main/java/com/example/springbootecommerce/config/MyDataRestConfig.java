package com.example.springbootecommerce.config;

import com.example.springbootecommerce.entity.Country;
import com.example.springbootecommerce.entity.Product;
import com.example.springbootecommerce.entity.ProductCategory;
import com.example.springbootecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;

    private EntityManager entityManager;
    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        this.entityManager = theEntityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
//        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
        HttpMethod[] theUnSupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};
        // Disable Http methods for Product, ProductCtegory, Country and State : PUT, POST and DELETE
        disableHttpMethods(Product.class ,config, theUnSupportedActions);
        disableHttpMethods(ProductCategory.class ,config, theUnSupportedActions);
        disableHttpMethods(Country.class ,config, theUnSupportedActions);
        disableHttpMethods(State.class ,config, theUnSupportedActions);

        // call an internal helper method to expose the id
        exposeIds(config);

        // Configure the cors mapping
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);
    }

    private static void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnSupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        // get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        // create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();
        // get the entity types for the entities
        for (EntityType tempEntityType : entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }
        // expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }


}
