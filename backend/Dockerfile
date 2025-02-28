# -- Stage 1: Build the Go binary --
    FROM golang:1.23-alpine AS builder

    # Install build tools so we can compile CGO code (for go-sqlite3)
    RUN apk update && apk add --no-cache gcc g++ make
    
    # Enable CGO
    ENV CGO_ENABLED=1
    
    # Set our working directory
    WORKDIR /app
    
    # Copy go.mod and go.sum first (cache module downloads)
    COPY go.mod go.sum ./
    RUN go mod download
    
    # Copy the rest of the source code
    COPY . .
    
    # Build the Go binary (with CGO enabled)
    RUN go build -o main .
    
    # -- Stage 2: Run the Go binary in a minimal image --
    FROM alpine:3.17
    
    # For CGO-based binaries, we often need the C runtime libraries
    RUN apk add --no-cache libc6-compat
    
    WORKDIR /app
    
    # Copy the compiled binary from the builder stage
    COPY --from=builder /app/main .
    
    # (Optional) Copy your SQLite DB if you want it inside the container
    COPY myapp.db .
    
    # Expose port 8080 (adjust if your Go app listens on a different port)
    EXPOSE 8080
    
    # Run the binary
    CMD ["./main"]
    