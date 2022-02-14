package com.accenture.web.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.accenture.web.GroceryBillApplication;
import com.accenture.web.model.Clerk;
import com.accenture.web.repository.ClerkRepository;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ClerkController {

	@Autowired
	private ClerkRepository clerkRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@GetMapping("/user/view")
	public GroceryBillApplication viewClerk() {
		List<Clerk> clerkList = clerkRepository.findAll();
		GroceryBillApplication groceryBillApplication = new GroceryBillApplication();
		groceryBillApplication.setClerkList(clerkList);
		return groceryBillApplication;
	}

	@GetMapping("/user/auth/{username}")
	public ResponseEntity<Map<String, Boolean>> userSignupUsername(@PathVariable String username) {

		RestTemplate restTemplate = new RestTemplate();

		final String fetchApi = "http://localhost:8080/api/user/view";
		GroceryBillApplication groceryBillApplication = restTemplate.getForObject(fetchApi,
				GroceryBillApplication.class);

		for (Clerk clerk : groceryBillApplication.getClerkList()) {

			if (username.equals(clerk.getUsername())) {

				Map<String, Boolean> responseMap = new HashMap<>();
				responseMap.put("isExist", Boolean.TRUE);
				return ResponseEntity.ok(responseMap);
			}
		}
		Map<String, Boolean> responseMap = new HashMap<>();
		responseMap.put("isExist", Boolean.FALSE);
		return ResponseEntity.ok(responseMap);
	}

	@GetMapping("/user/auth/{username}/{password}")
	public ResponseEntity<Map<String, Boolean>> userLogin(@PathVariable String username,
			@PathVariable String password) {

		RestTemplate restTemplate = new RestTemplate();

		final String fetchApi = "http://localhost:8080/api/user/view";
		GroceryBillApplication groceryBillApplication = restTemplate.getForObject(fetchApi,
				GroceryBillApplication.class);

		for (Clerk clerk : groceryBillApplication.getClerkList()) {

			if (username.equals(clerk.getUsername())) {

				boolean isPasswordMatches = passwordEncoder.matches(password, clerk.getPassword());

				if (isPasswordMatches) {

					Map<String, Boolean> responseMap = new HashMap<>();
					responseMap.put("isAuthenticated", Boolean.TRUE);
					return ResponseEntity.ok(responseMap);
				}
			}
		}
		Map<String, Boolean> responseMap = new HashMap<>();
		responseMap.put("isAuthenticated", Boolean.FALSE);
		return ResponseEntity.ok(responseMap);
	}

	@PostMapping("/user/signup")
	public Clerk userAdd(@RequestBody Clerk clerks) {
		Clerk clerk = new Clerk();
		clerk.setUsername(clerks.getUsername());
		clerk.setPassword(passwordEncoder.encode(clerks.getPassword()));
		clerk.setEmail(clerks.getEmail());
		clerk.setPhoneNumber(clerks.getPhoneNumber());

		return clerkRepository.save(clerk);
	}
}
