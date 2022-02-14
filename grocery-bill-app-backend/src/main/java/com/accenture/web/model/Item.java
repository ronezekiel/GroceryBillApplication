package com.accenture.web.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "items")
public class Item {

	@Id
	private String id;
	@Column(name = "name")
	private String name;
	@Column(name = "price")
	private double price;
	@Column(name = "is_discounted")
	private boolean isDiscounted;
	@Column(name = "discount_percentage")
	private double discountPercentage;
	@Column(name = "actual_price")
	private double actualPrice;
	@Column(name = "made_by")
	private String madeBy;
	@Column(name = "created_on")
	private String createdOn;

	public Item(String id, String name, double price, boolean isDiscounted, double discountPercentage,
			double actualPrice, String madeBy, String createdOn) {
		super();
		this.id = id;
		this.name = name;
		this.price = price;
		this.isDiscounted = isDiscounted;
		this.discountPercentage = discountPercentage;
		this.actualPrice = actualPrice;
		this.madeBy = madeBy;
		this.createdOn = createdOn;
	}
	public Item() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(String createdOn) {
		this.createdOn = createdOn;
	}

	public String getMadeBy() {
		return madeBy;
	}

	public void setMadeBy(String madeBy) {
		this.madeBy = madeBy;
	}

	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public boolean getDiscounted() {
		return isDiscounted;
	}

	public void setDiscounted(boolean isDiscounted) {
		this.isDiscounted = isDiscounted;
	}
	
	public double getDiscountPercentage() {
		return discountPercentage;
	}

	public void setDiscountPercentage(double discountPercentage) {
		this.discountPercentage = discountPercentage;
	}

	public double getActualPrice() {
		return actualPrice;
	}

	public void setActualPrice(double actualPrice) {
		this.actualPrice = actualPrice;
	}

}
