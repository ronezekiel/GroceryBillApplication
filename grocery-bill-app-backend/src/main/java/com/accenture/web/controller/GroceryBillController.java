package com.accenture.web.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.accenture.web.repository.ItemRepository;
import com.accenture.web.GroceryBillApplication;
import com.accenture.web.exception.ResourceNotFoundException;
import com.accenture.web.model.Item;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class GroceryBillController {

	@Autowired
	private ItemRepository itemRepository;

	@GetMapping("/item/view")
	public List<Item> itemList() {
		return itemRepository.findAll();
	}
	
	@GetMapping("/item/show")
	public GroceryBillApplication getItem() {
		List<Item> itemList = itemRepository.findAll();
		GroceryBillApplication groceryBillApplication = new GroceryBillApplication();
		groceryBillApplication.setItemList(itemList);
		return groceryBillApplication;
	}
	@GetMapping("/item/view/{id}")
	public ResponseEntity<Item> getItemById(@PathVariable String id){
		Item item = itemRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Item not exist with id: " + id));
		return ResponseEntity.ok(item);
	}
	
	@GetMapping("/item/total/{username}")
	public double getTotalBill(@PathVariable String username) {
		RestTemplate restTemplate = new RestTemplate();
		final String fetchItemApi = "http://localhost:8080/api/item/show";
		GroceryBillApplication groceryBillApplication = restTemplate.getForObject(fetchItemApi, GroceryBillApplication.class);
		double total = 0;
		
		for (Item item : groceryBillApplication.getItemList()) {
			if (username.equals(item.getMadeBy())) {
					total += item.getActualPrice();
			}
		}
		double roundDbl = Math.round(total*100.0)/100.0;
		
		return roundDbl;
	}
	
	@PostMapping("/item/add")
	public Item addItem(@RequestBody Item item) {
		return itemRepository.save(item);
	}

	@DeleteMapping("/item/delete/{id}")
	public ResponseEntity<Map<String, Boolean>> deleteItem(@PathVariable String id) {
		Item item = itemRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Item not exist with id: " + id));

		itemRepository.delete(item);
		Map<String, Boolean> response = new HashMap<>();
		response.put(id + " is deleted successfully!", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}
	
	@PutMapping("/item/update/{id}")
	public ResponseEntity<Item> updateItem(@PathVariable String id, @RequestBody Item itemDetails){
		Item item = itemRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Item not exist with id: " + id));
		
		item.setId(itemDetails.getId());
		item.setName(itemDetails.getName());
		item.setPrice(itemDetails.getPrice());
		item.setDiscounted(itemDetails.getDiscounted());
		item.setDiscountPercentage(itemDetails.getDiscountPercentage());
		item.setActualPrice(Math.round(itemDetails.getActualPrice()*100.0)/100.0);
		
		Item response = itemRepository.save(item);
		
		return ResponseEntity.ok(response);
	}
	

}
