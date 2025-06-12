package com.lodzrestaurants.lodzrestaurants.configuration;

import com.lodzrestaurants.lodzrestaurants.configuration.security.JwtService;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.*;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Random;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantCategoryRepository restaurantCategoryRepository;
    private final DishRepository dishRepository;
    private final MenuRepository menuRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            generateAdminUser();
            if (restaurantRepository.count() > 0) {
                return;
            }

            addSusharniaRestaurant();
            addWhiskeyInTheJarRestaurant();
            addAdditionalRestaurants();
        };
    }

    private void generateAdminUser() {
        if (userRepository.existsById("admin")) {
            return;
        }
        User adminUser = new User("admin", "admin123", User.UserRole.ADMIN);
        User user = new User("user", "user123", User.UserRole.USER, "Wojciech", "Wafel", "123456789", "wojciech.wafel@gmail.com");
        userRepository.save(user);
        userRepository.save(adminUser);
        log.info("Admin user created with username: {} and password: {}", adminUser.getUsername(), adminUser.getPassword());
        log.info("Admin JWT Token: {}", jwtService.generateToken(adminUser.getUsername()));
    }

    public void addSusharniaRestaurant() {
        RestaurantCategory sushiCategory = restaurantCategoryRepository
                .findByCategoryName("Sushi")
                .orElseGet(() -> restaurantCategoryRepository.save(new RestaurantCategory("Sushi")));
        
        Restaurant restaurant = Restaurant.builder()
                .name("Susharnia")
                .description("A sushi restaurant offering various lunch options.")
                .localization(new Localization(51.77720949875417, 19.45797264481472))
                .restaurantCategory(sushiCategory)
                .ranking(new Ranking(4.5))
                .build();

        restaurantRepository.save(restaurant);

        Menu menu = new Menu("Susharnia Menu", "Various lunch options for sushi lovers.");
        menuRepository.save(menu);

        restaurant.setMenu(menu);
        restaurantRepository.save(restaurant);

        dishRepository.save(new Dish("Beef lunch", "wołowina w sosie chili-tahini, warzywa, ryż/makaron\nfried sweet-chili beef, vegetables, rice or udon(noodles)", 42.0, menu, true));
        dishRepository.save(new Dish("Chicken lunch", "udko z kurczaka w sosie sojowo-miodowym, warzywa, ryż/makaron\nchicken in soya-honey sauce, vegetables, rice or udon", 42.0, menu));
        dishRepository.save(new Dish("Classic lunch 13 sztuk", "2 nigiri, 5 philadelphia sake, 6 hosomaki", 54.0, menu));
        dishRepository.save(new Dish("Grilled lunch 10 sztuk", "5 tempura tamago, 5 philadelphia sake teryiaki\nzdjęcie poglądowe, nie stanowi oferty", 49.0, menu));
        dishRepository.save(new Dish("Maki lunch 16 sztuk", "6 tempura futomaki, 5 tamago philadelphia, 5 philadelphia sake teryiaki\nZdjęcie poglądowe, nie stanowi oferty.", 63.0, menu));
        dishRepository.save(new Dish("Vege lunch 15 sztuk", "6 mushrooms vege roll, 6 hosomaki, 5 philadelphia vege", 45.0, menu));
        dishRepository.save(new Dish("Nigiri vege", "dowolne dostępne warzywo lub owoc (kanpyo, avocado, mango, ogórek, tamago) - 2szt.\nAny available vegetable or fruit (kanpyo, avocado, mango, cucumber, tamago) - 2pcs.", 18.0, menu));
        dishRepository.save(new Dish("Nigiri z rybą", "dowolna dostępna ryba (łosoś, tuńczyk, krewetka, węgorz, seriola) - 2szt.\nAny available fish (salmon, tuna, shrimp, eel) - 2pcs.", 25.0, menu));
        dishRepository.save(new Dish("Hosomaki Kanpyo Tempura", "Hosomaki z kanpyo, wasabi, majonez truflowy sos unagi - całość zapieczona w tempurze.", 23.0, menu));
        dishRepository.save(new Dish("Hosomaki vege", "Jednoskładnikowa rolka z dowolnym dostępne warzywem lub owocem (kanpyo, avocado, mango, ogórek, tamago)\nAny available vegetable or fruit (kanpyo, avocado, mango, cucumber, tamago)", 18.0, menu));
        dishRepository.save(new Dish("Hosomaki z rybą", "Jednoskładnikowa rolka z dowolną dostępną rybą (łosoś, tuńczyk, węgorz, seriola)\nAny available fish (salmon, tuna, shrimp, eel)", 22.0, menu, true));
        dishRepository.save(new Dish("Bluefin futomaki", "Tuńczyk błękitnopłetwy, avocado, sezam, szczypior, nikiri", 40.0, menu));
        dishRepository.save(new Dish("Deluxe futomaki", "łosoś, tuńczyk, ogórek, mango, kanpyo, kawior\nsalmon, tuna, cucumber, mango, kanpyo, caviar.", 29.0, menu));
        dishRepository.save(new Dish("Fit futomaki (bez ryżu)", "łosoś, tuńczyk, mango, ogórek, kanpyo, sałata, serek.\nsalmon, tuna, mango, cucumber, kanpyo, salad, philadelphia - all without rice.", 34.0, menu));
        dishRepository.save(new Dish("Kimchi Futomaki", "sałatka kimchi, ogórek, kanpyo, sałata\nkimchi salad, cucumber, kanpyo, salad.", 28.0, menu));
        dishRepository.save(new Dish("Panko Kimchi Futomaki", "kimchi, ogórek, kanpyo - całość zapieczona w panko.", 31.0, menu));
        dishRepository.save(new Dish("Spicy Almond Ebi", "ananas, jalapeno, krewetka w migdałach, ogórek, kanpyo.", 33.0, menu));
        dishRepository.save(new Dish("Unagi futomaki", "węgorz kabayiaki, ogórek, kanpyo, mango, serek, sos unagi\neel, cucumber, kanpyo, mango, philadelphia, unagi sauce.", 30.0, menu));
        dishRepository.save(new Dish("Vege futomaki", "serek, kanpyo, sałata, mango, ogórek, tamago, sos serowo-sezamowy\nphiladelphia, kanpyo, salad, mango, cucumber, tamago, cheese and sesame sauce.", 28.0, menu));
        dishRepository.save(new Dish("Ebi Avocado Roll", "Dwie krewetki, serek, ogórek, kanpyo, na zewnątrz awokado.\nTwo shrimps, philadelphia, cucumber, kanpyo, avocado on top.", 32.0, menu));
        dishRepository.save(new Dish("Philadelphia maguro", "tuńczyk, serek, ogórek, kanpyo, mango, sos serowo-sezamowy\ntuna, philadelphia, cucumber, kanpyo, mango, cheese and sesame sauce.", 29.0, menu));
        dishRepository.save(new Dish("Philadelphia sake", "łosoś, serek, ogórek, kanpyo, kawior.\nsalmon, philadelphia, cucumber, kanpyo, caviar.", 28.0, menu));
        dishRepository.save(new Dish("Philadelphia Vege", "Grillowane tofu, serek, avocado, kanpyo, papryka, sos serowo-sezamowy\nGrilled tofu, philadelphia, avocado, kanpyo, pepper, cheese and sesame sauce.", 27.0, menu));
        dishRepository.save(new Dish("Sake guacamole roll", "surowy łosoś, rukola, guacamole, dymka, orzechy nerkowca.\nsalmon, arugula, guacamole, onion, cashew nuts.", 32.0, menu));
        dishRepository.save(new Dish("Sake unagi roll", "łosoś, ostry majonez, kanpyo, ogórek, na zewnątrz węgorz, sos unagi, sezam\nsalmon, spicy mayo, kanpyo, cucumber - eel, unagi sauce, sesame sauce on top.", 32.0, menu));
        dishRepository.save(new Dish("Vege tamago", "grzyby shitake, serek, ogórek, papryka, kanpyo, mango, całość owinięta tamago\nshiitake mushrooms, philadelphia, cucumber, pepper, kanpyo, mango - wrapped in tamago.", 28.0, menu));
        dishRepository.save(new Dish("Beef roll", "smażona marynowana wołowina, ogórek, sałata, szczypior, majonez truflowy\nfried beef, chives, salad, cucumber, unagi sauce, truffle mayo.", 27.0, menu));
        dishRepository.save(new Dish("Chicken roll", "kurczak w panko, ogórek, ostry majonez, sałata, kanpyo, sos unagi\nchicken in panko, cucumber, spicy mayo, salad, kanpyo, unagi sauce.", 26.0, menu));
        dishRepository.save(new Dish("Duck tempura", "kaczka w panko, ostry majonez, jalapeno, ogórek, kanpyo.\nduck in panko, spicy mayo, jalapeno, cucumber, kanpyo.", 27.0, menu));
        dishRepository.save(new Dish("Grilled avocado roll", "grillowany łosoś, serek, ogórek, kanpyo, liczi, owinięte avocado, sos unagi, sos sezam.\ngrilled salmon, philadelphia, cucumber, kanpyo, lychee - avocado unagi, sesame sauce on top.", 27.0, menu));
        dishRepository.save(new Dish("Maguro Teriyaki Roll", "tuńczyk w tempurze, majonez limonkowy, mango, ogórek, kanpyo\ntuna in panko, lime and mint mayo, mango, cucumber, kanpyo.", 26.0, menu));
        dishRepository.save(new Dish("Mushrooms vege roll", "boczniaki marynowane i smażone, ogórek, kanpyo, rukola, awokado, orzechy nerkowca.\nMarinated and fried oyster mushrooms, cucumber, kanpyo, avocado, arugula, cashew nuts.", 27.0, menu));
        dishRepository.save(new Dish("Special Ebiten Roll", "Krewetka w tempurze, serek, kanpyo, ogórek, tatar z łososia i sos sriracha na zewnątrz.\nShrimp in panko, philadelphia, kanpyo, cucumber - salmon tartare and sriracha sauce on top.", 32.0, menu));
        dishRepository.save(new Dish("Tempura futomaki", "łosoś lub tuńczyk, ogórek, kanpyo - całość zapieczona w tempurze, ostry majonez\nsalmon or tuna, cucumber, kanpyo - all fried in tempura. spicy mayo on top.", 28.0, menu));
        dishRepository.save(new Dish("Tempura tamago", "łosoś/tuńczyk/krewetka w tempurze, serek, ogórek, mango, kanpyo, owinięte w tamago, sos serowo-sezamowy, sos unagi\nsalmon or tuna or shrimp in panko, philadelphia, cucumber, mango - all wrapped in tamago. cheese and sesame sauce, unagi sauce on top.", 28.0, menu));
        dishRepository.save(new Dish("Vege tempura futomaki", "warzywa w tempurze, ostry majonez\nvegetables in tempura, spicy mayo.", 26.0, menu));
        dishRepository.save(new Dish("Almond kiwi roll", "Krewetka w tempurze, serek philadelphia, oshinko, kanpyo, ogórek, na zewnątrz kiwi, prażone migdały i sos unagi\nShrimp in tempura, philadelphia, oshinko, kanpyo, cucumber - kiwi, roasted almonds, unagi sauce on top.", 32.0, menu));
        dishRepository.save(new Dish("Avocado roll", "łosoś, tuńczyk, serek, mango, ogórek, kanpyo, na zewnątrz avocado, sos unagi, sezam\nsalmon, tuna, philadelphia, mango, cucumber, kanpyo - avocado, unagi sauce, sesame on top.", 31.0, menu));
        dishRepository.save(new Dish("Devill roll", "krewetka w tempurze, wasabi, spicy mayo, ogórek, liczi, kanpyo, na zewnątrz 3 rodzaje opalanych ryb, togarashi, sos unagi\nShrimp in tempura, kizami wasabi, spicy mayo, cucumber, lychee, kanpyo - three types of tanned fish, togarashi, unagi sauce on top.", 32.0, menu));
        dishRepository.save(new Dish("Ebi Sake Roll", "krewetka w tempurze, serek, ogórek, liczi, kanpyo, na zewnątrz łosoś surowy/opalany\nShrimp in tempura, philadelphia, cucumber, lychee, kanpyo - raw or tanned salmon on top.", 32.0, menu));
        dishRepository.save(new Dish("Golden Bluefin", "tuńczyk błękitnopłetwy, ogórek, mango, kanpyo, ikura, szczypior, jalapeno\nBluefin tuna, cucumber, mango, kanpyo, ikura, chives, jalapeno.", 41.0, menu));
        dishRepository.save(new Dish("Golden california", "łosoś, ogórek, kanpyo, majonez, na zewnątrz łosoś, kawior, szczypior\nSalmon, cucumber, kanpyo, spicy mayo - salmon, caviar, chives on top.", 33.0, menu));
        dishRepository.save(new Dish("Gunkan futomaki", "tatar z łososia, szczypior, sałata\nSalmon tartare, chives, salad.", 32.0, menu));
        dishRepository.save(new Dish("Leek Butter Ebi", "Krewetki smażone na maśle, por, mango, ogórek, na zewnątrz togarashi i limonka\nFried shrimps, leek, mango, cucumber - togarashi and lime on top.", 34.0, menu));
        dishRepository.save(new Dish("Philadelphia sake teryiaki", "grillowany łosoś, serek, ogórek, kanpyo, orzechy nerkowca, sos mango, sos unagi, sezam\nGrilled salmon, philadelphia, cucumber, kanpyo, cashew nuts, mango sauce, unagi and sesame.", 30.0, menu));
        dishRepository.save(new Dish("Rolka Miesiąca", "W środku: krewetka w tempurze, papryka teryiaki, ogórek, kanpyo. Na zewnątrz: tuńczyk błękitnopłetwy, mango, mayo-truflowe, szczypior, sezam\nInside: shrimp in tempura, teriyaki pepper, cucumber, kanpyo. Outside: bluefin tuna, mango, truffle mayo, chives, sesame.", 43.0, menu));
        dishRepository.save(new Dish("Sake Ebi Padron", "Krewetki smażone na maśle, ogórek, kanpyo, sałata, łosoś, papryczka padron, ikura, limonka\nFried shrimps, cucumber, kanpyo, salad, salmon, padron pepper, ikura, lime.", 39.0, menu));
        dishRepository.save(new Dish("Sake mango roll", "surowy łosoś, ogórek, kanpyo, na zewnątrz mango, sos unagi\nRaw salmon, cucumber, kanpyo - mango and unagi sauce on top.", 31.0, menu));
        dishRepository.save(new Dish("Spicy Ebi Futomaki", "Krewetka w tempurze, tatar z łososia, jalapeno, sałata\nShrimp in tempura, salmon tartare, jalapeno, salad.", 32.0, menu));
        dishRepository.save(new Dish("Tamago philadelphia", "łosoś lub tuńczyk, serek, mango, ogórek, kanpyo, owinięte tamago\nRaw salmon or raw tuna, philadelphia, mango, cucumber, kanpyo - all wrapped in tamago.", 28.0, menu));
        dishRepository.save(new Dish("Tempura futomaki z tatarem", "Ogórek, kanpyo - całość zapieczona w tempurze i przykryta tatarem z łososia\nCucumber and kanpyo - all fried in tempura. Salmon tartare on top.", 35.0, menu));
        dishRepository.save(new Dish("Unagi mango roll", "węgorz kabayiaki, ogórek, kanpyo, na zewnątrz mango, sos unagi, sezam\nEel, cucumber, kanpyo - mango, unagi sauce, sesame on top.", 30.0, menu));
        dishRepository.save(new Dish("Gunkan 2 szt.", "do wyboru: łosoś/tuńczyk/węgorz owinięte ogórkiem\nAny available fish: salmon/tuna/eel - all wrapped in cucumber.", 32.0, menu));
        dishRepository.save(new Dish("Sashimi", "kawałki surowej ryby (łosoś, tuńczyk, węgorz, krewetka)\nPieces of any available raw fish (salmon, tuna, eel, shrimp).", 32.0, menu));
        dishRepository.save(new Dish("Nigiri set 12 sztuk", "Zestaw surowy, na który składa się: 12 nigiri mix\nRaw set consisting of 12 nigiri mix.", 120.0, menu));
        dishRepository.save(new Dish("Mini set 13 sztuk", "Zestaw surowy, na który składa się: 2 nigiri, 5 philadelphia sake, 6 hosomaki\nRaw set consisting of 2 nigiri, 5 philadelphia sake, 6 hosomaki.", 66.0, menu));
        dishRepository.save(new Dish("Fest set 21 sztuk", "Zestaw surowy, na który składa się: 4 nigiri, 6 gunkan futomaki, 5 tamago philadelphia, 6 hosomaki\nRaw set consisting of 4 nigiri, 6 gunkan futomaki, 5 tamago philadelphia, 6 hosomaki.", 122.0, menu));
    }

    public void addWhiskeyInTheJarRestaurant() {
        // Find or create the category first
        RestaurantCategory steakhouseCategory = restaurantCategoryRepository
                .findByCategoryName("Steakhouse")
                .orElseGet(() -> restaurantCategoryRepository.save(new RestaurantCategory("Steakhouse")));
        
        Restaurant restaurant = Restaurant.builder()
                .name("Whiskey in the Jar")
                .description("A steakhouse and bar offering a variety of dishes and drinks.")
                .localization(new Localization(51.780408391183364, 19.450547992106593))
                .restaurantCategory(steakhouseCategory)
                .build();

        restaurantRepository.save(restaurant);

        Menu menu = new Menu("Whiskey in the jar menu", "Brak opisu.");
        menuRepository.save(menu);

        restaurant.setMenu(menu);
        restaurantRepository.save(restaurant);

        dishRepository.save(new Dish("Big Burger", "180g wołowiny, ser, boczek, sałata, pomidor, ogórek, rukola, cebula, sos paprykowo-czosnkowy. Podawany z frytkami stekowymi.", 45.0, menu));
        dishRepository.save(new Dish("Country Burger", "180g wołowiny, jajko sadzone, boczek, sałata, pomidor, cebula, rukola, sos Dijon. Podawany z frytkami stekowymi.", 47.0, menu));
        dishRepository.save(new Dish("El Diablo Burger", "180g wołowiny, jalapeño, nachos, ser, boczek, sałata, rukola, sos chipotle. Podawany z frytkami stekowymi.", 49.0, menu));
        dishRepository.save(new Dish("Chicken Burger", "Chrupiący kurczak z chutneyem mango i chili, sałata, cebula, pomidor, roszponka. Podawany z frytkami stekowymi.", 44.0, menu));
        dishRepository.save(new Dish("Rock’n’Steak", "200/280g polędwicy wołowej z sosem i dwoma dodatkami do wyboru.", 85.0, menu));
        dishRepository.save(new Dish("Grillowane żeberka BBQ", "500g żeberek z BBQ z dwoma dodatkami.", 65.0, menu));
        dishRepository.save(new Dish("Polędwiczki z kurczaka", "Chrupiące polędwiczki marynowane w tequili z dwoma dodatkami.", 52.0, menu));
        dishRepository.save(new Dish("Stek z łososia", "Z masłem z limonki i ziołami oraz dwoma dodatkami.", 59.0, menu));
        dishRepository.save(new Dish("Premium Mix Grill", "Polędwica, antrykot sezonowany, rostbef marmurkowany, 2 sosy, ogórki konserwowe.", 110.0, menu));
        dishRepository.save(new Dish("Tatar Rockersów", "Polędwica wołowa na chrupiącym chlebie, serwowana na desce.", 35.0, menu));
        dishRepository.save(new Dish("Blooming Onion", "Chrupiąca cebula w panierce z mąki kukurydzianej i chili.", 28.0, menu));
        dishRepository.save(new Dish("Bruschetta", "Z pomidorami, bazylią, posypana serem feta.", 24.0, menu));
        dishRepository.save(new Dish("Nachos", "Z sosem serowym lub ostrym do wyboru.", 22.0, menu));
        dishRepository.save(new Dish("Roast Beef w słoiku", "Plastry wołowiny w pikantnym sosie i marynowanej cebuli.", 29.0, menu));
        dishRepository.save(new Dish("Mus z białej czekolady", "Deser z białej czekolady i owoców.", 21.0, menu));
        dishRepository.save(new Dish("Szarlotka z lodami", "Ciepła szarlotka z lodami waniliowymi.", 24.0, menu));
        dishRepository.save(new Dish("Nuggetsy (dla dzieci)", "Chrupiące polędwiczki z frytkami stekowymi.", 22.0, menu));
        dishRepository.save(new Dish("Nemo", "Filet z łososia z ryżem i warzywami.", 25.0, menu));
        dishRepository.save(new Dish("Mini burger Fernando", "Mini burger w zestawie dla dzieci.", 24.0, menu));
    }

    public void addAdditionalRestaurants() {
        addRestaurantWithMenu("Pasta Paradise", "Italian restaurant specializing in pasta dishes.",
                new Localization(51.776, 19.459), "Italian", "Spaghetti Carbonara",
                "Classic Italian pasta with creamy sauce, pancetta, and Parmesan.", 35.0);

        addRestaurantWithMenu("Burger Haven", "Gourmet burgers with unique flavors.",
                new Localization(51.778, 19.460), "Burgers", "Truffle Burger",
                "Beef patty with truffle mayo, arugula, and Swiss cheese.", 42.0);

        addRestaurantWithMenu("Taco Fiesta", "Authentic Mexican tacos and more.",
                new Localization(51.779, 19.461), "Mexican", "Chicken Tacos",
                "Soft tacos with grilled chicken, salsa, and guacamole.", 28.0);

        addRestaurantWithMenu("Pizza Palace", "Wood-fired pizzas with fresh ingredients.",
                new Localization(51.780, 19.462), "Pizza", "Margherita Pizza",
                "Classic pizza with tomato sauce, mozzarella, and basil.", 30.0);

        addRestaurantWithMenu("Sushi World", "Fresh sushi and sashimi.",
                new Localization(51.781, 19.463), "Sushi", "Salmon Nigiri",
                "Two pieces of fresh salmon on seasoned rice.", 25.0);

        addRestaurantWithMenu("Steakhouse Deluxe", "Premium steaks and sides.",
                new Localization(51.782, 19.464), "Steakhouse", "Ribeye Steak",
                "Grilled ribeye steak with garlic butter and mashed potatoes.", 85.0);

        addRestaurantWithMenu("Vegan Delight", "Plant-based meals for everyone.",
                new Localization(51.783, 19.465), "Vegan", "Vegan Buddha Bowl",
                "Quinoa, roasted vegetables, and tahini dressing.", 32.0);

        addRestaurantWithMenu("Seafood Shack", "Fresh seafood dishes.",
                new Localization(51.784, 19.466), "Seafood", "Grilled Salmon",
                "Grilled salmon with lemon butter sauce and asparagus.", 50.0);

        addRestaurantWithMenu("BBQ Barn", "Smoked meats and BBQ classics.",
                new Localization(51.785, 19.467), "BBQ", "Pulled Pork Sandwich",
                "Slow-cooked pulled pork with BBQ sauce on a brioche bun.", 38.0);

        addRestaurantWithMenu("Dessert Dreams", "Sweet treats and desserts.",
                new Localization(51.786, 19.468), "Desserts", "Chocolate Lava Cake",
                "Warm chocolate cake with a gooey center, served with vanilla ice cream.", 20.0);
    }

    private void addRestaurantWithMenu(String name, String description, Localization localization,
                                       String category, String dishName, String dishDescription, double price) {
        RestaurantCategory restaurantCategory = restaurantCategoryRepository
                .findByCategoryName(category)
                .orElseGet(() -> {
                    RestaurantCategory newCategory = new RestaurantCategory(category);
                    return restaurantCategoryRepository.save(newCategory);
                });

        Restaurant restaurant = Restaurant.builder()
                .name(name)
                .description(description)
                .localization(localization)
                .restaurantCategory(restaurantCategory)
                .ranking(new Ranking((double)new Random().nextInt(2, 4)))
                .build();
        restaurantRepository.save(restaurant);

        Menu menu = new Menu(name + " Menu", "Menu for " + name);
        menuRepository.save(menu);

        restaurant.setMenu(menu);
        restaurantRepository.save(restaurant);

        dishRepository.save(new Dish(dishName, dishDescription, price, menu));
    }
}
