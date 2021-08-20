

function Noeud(crayon,x,y,dx,dy,nom,type,bordures,fonds,couleursTexte){
	
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;

	this.nom = nom;
	this.type = type;
	
	this.ETAT = 0;
	
	this.crayon = crayon;
	
	this.visible = true;
	
	this.bordures = bordures;// liste contenant pour chaque etat : [couleur, epaisseur]
	this.fonds = fonds;
	this.couleursTexte = couleursTexte;
	
	this.tracer = function(){
		if(this.visible){
			
			this.crayon.beginPath();
			
			this.crayon.fillStyle = this.fonds[this.ETAT];
			this.crayon.lineWidth = this.bordures[this.ETAT][1];//epaisseur de la bordures
			this.crayon.strokeStyle = this.bordures[this.ETAT][0];//couleur de la bordures
			
			this.crayon.textAlign = 'center';
			this.crayon.textBaseline = 'middle';
			
			/*   ---   Cas d'un cercle   ---   */
			if(this.type =="Cercle"){
				this.crayon.arc(this.x, this.y, this.dx , 0 , Math.PI*2 , true);
				this.crayon.fill();
				this.crayon.stroke();
				
				
				var police = 30;
				this.crayon.font = police+'pt Calibri';
				
				while(this.crayon.measureText(this.nom).width > 2*this.dx/1.4-2 || this.crayon.measureText(this.nom).height > 2*this.dx/1.4-2){//tant que le texte ne rentre pas
					police = police-1;
					this.crayon.font = police+'pt Calibri';
				}
				
				this.crayon.fillStyle = this.couleursTexte[this.ETAT];
				
				this.crayon.fillText(this.nom, this.x, this.y);
			}
			
			if(this.type =="Rectangle"){
				this.crayon.rect(this.x-this.dx, this.y-this.dy, 2*this.dx , 2*this.dy);
				
				this.crayon.fill();	
				
				this.crayon.stroke();
				
				
				var police = 30;
				this.crayon.font = police+'pt Calibri';
				
				while(this.crayon.measureText(this.nom).width > 2*this.dx-2 || this.crayon.measureText(this.nom).height > 2*this.dy-2){//tant que le texte ne rentre pas
					police = police-1;
					this.crayon.font = police+'pt Calibri';
				}
				
				this.crayon.fillStyle = this.couleursTexte[this.ETAT];
				
				this.crayon.fillText(this.nom, this.x, this.y);
			}
		}
			
	}
	
	this.getInfos = function(){
		return [this.x,this.y,this.dx,this.dy,this.type,this.nom];
	}
	
	this.isVisible = function(){
		return this.visible;
	}
	
	this.In = function(x,y){
		if(this.type =="Rectangle"){
			if(x > this.x-this.dx   &&  y > this.y-this.dy   &&   x < this.x+this.dx   &&  y < this.y+this.dy){
				return true;
			}
			else{
				return false;
			}
		}
		
		else if(this.type == "Cercle"){
			var Dx = (x-this.x)
			var Dy = (y-this.y)
			var r = Dx*Dx + Dy*Dy;
			
			if(r<this.dx*this.dx){
				return true;
			}
			else{
				return false;
			}
		}
	}

}

