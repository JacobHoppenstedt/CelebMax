package main

import "time"

type User struct {
	ID           uint   `gorm:"primaryKey"`
	Email        string `gorm:"uniqueIndex"`
	PasswordHash string
	CreatedAt    time.Time
}

type Favorite struct {
	ID        uint `gorm:"primaryKey"`
	UserID    uint `gorm:"index"`
	ImagePath string
	CreatedAt time.Time
}
