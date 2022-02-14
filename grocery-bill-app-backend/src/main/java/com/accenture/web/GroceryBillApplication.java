package com.accenture.web;

import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.accenture.web.model.Clerk;
import com.accenture.web.model.Item;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class GroceryBillApplication {

	private List<Clerk> clerkList;

	public List<Clerk> getClerkList() {
		return clerkList;
	}

	public void setClerkList(List<Clerk> clerkList) {
		this.clerkList = clerkList;
	}

	private List<Item> itemList;

	public List<Item> getItemList() {
		return itemList;
	}

	public void setItemList(List<Item> itemList) {
		this.itemList = itemList;
	}

	public static void main(String[] args) {
		SpringApplication.run(GroceryBillApplication.class, args);
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	}

}
