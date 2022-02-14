package com.accenture.web.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.accenture.web.GroceryBillApplication;
import com.accenture.web.model.Item;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class RegularBillController {

	@GetMapping("/item/regular")
	public GroceryBillApplication getRegularItem() {

		RestTemplate restTemplate = new RestTemplate();

		final String fetchItemApi = "http://localhost:8080/api/item/show";
		GroceryBillApplication groceryBillApplication = restTemplate.getForObject(fetchItemApi,
				GroceryBillApplication.class);

		GroceryBillApplication itemRegularList = new GroceryBillApplication();
		List<Item> items = new ArrayList<>();
		for (Item item : groceryBillApplication.getItemList()) {

			if (!item.getDiscounted()) {
				items.add(item);
			}
		}

		itemRegularList.setItemList(items);
		return itemRegularList;

	}

	@GetMapping("/item/regular/{username}")
	public double getTotalBill(@PathVariable String username) {

		RestTemplate restTemplate = new RestTemplate();

		final String fetchItemApi = "http://localhost:8081/api/item/regular";
		GroceryBillApplication groceryBillApplication = restTemplate.getForObject(fetchItemApi,
				GroceryBillApplication.class);

		double total = 0;

		for (Item item : groceryBillApplication.getItemList()) {
			if (username.equals(item.getMadeBy())) {
				total += item.getActualPrice();
			}
		}

		double roundDbl = Math.round(total * 100.0) / 100.0;

		return roundDbl;

	}

}
