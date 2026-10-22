# Builds the API and serves the front end from the same container.

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY backend/ItqanApi.csproj backend/
RUN dotnet restore backend/ItqanApi.csproj
COPY backend/ backend/
RUN dotnet publish backend/ItqanApi.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
# The API looks for the front end at ../frontend (relative to /app)
COPY frontend/ /frontend/

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "ItqanApi.dll"]
